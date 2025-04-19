import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Pic from "../assets/images/profile.jpg";
import * as Speech from "expo-speech";
import { router } from "expo-router";

const TTSFunction = ({ text, onBoundary }) => {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.8);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [textChunks, setTextChunks] = useState([]);
  const MAX_CHUNK_SIZE = 3000; // Safe limit for most devices

  // Split text into manageable chunks on component mount or when text changes
  useEffect(() => {
    if (!text) {
      setTextChunks([]);
      return;
    }
    
    // Split by sentences to avoid cutting in the middle of speech
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let currentChunk = "";
    
    sentences.forEach(sentence => {
      // If adding this sentence would exceed the chunk size, start a new chunk
      if (currentChunk.length + sentence.length > MAX_CHUNK_SIZE) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
        }
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence;
      }
    });
    
    // Add the last chunk if it's not empty
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }
    
    setTextChunks(chunks);
    setCurrentChunk(0);
    console.log(`Text split into ${chunks.length} chunks`);
  }, [text]);

  useEffect(() => {
    // Just perform a simple initialization
    try {
      // Simple initialization (not a real speak, just to initialize the engine)
      Speech.speak("", { 
        rate: speed,
        onError: (error) => console.log("Speech initialization error:", error)
      });
    } catch (error) {
      console.log("Error in speech initialization:", error);
    }
    
    // Cleanup when component unmounts
    return () => {
      Speech.stop();
      setPlaying(false);
    };
  }, []);

  const speakCurrentChunk = async () => {
    if (textChunks.length === 0 || currentChunk >= textChunks.length) return;
    
    try {
      console.log(`Speaking chunk ${currentChunk + 1} of ${textChunks.length}`);
      Speech.speak(textChunks[currentChunk], {
        language: "en-US",
        rate: speed,
        pitch: 1.1,
        onBoundary: onBoundary,
        onDone: handleChunkFinished,
        onStopped: () => setPlaying(false),
        onError: (error) => {
          console.log("Speech error:", error);
          setPlaying(false);
        }
      });
    } catch (error) {
      console.log("Error in speech:", error);
      setPlaying(false);
    }
  };
  
  const handleChunkFinished = () => {
    if (currentChunk < textChunks.length - 1) {
      // More chunks to speak
      console.log(`Chunk ${currentChunk + 1} finished, moving to next chunk`);
      setCurrentChunk(prev => prev + 1);
      // Small delay before starting the next chunk
      setTimeout(() => {
        speakCurrentChunk();
      }, 300);
    } else {
      // All chunks finished
      console.log("All chunks finished");
      setPlaying(false);
      setCurrentChunk(0);
    }
  };

  const speak = async () => {
    if (textChunks.length === 0) {
      console.log("No text to speak");
      return;
    }
    
    if (playing) {
      console.log("Stopping speech");
      Speech.stop();
      setPlaying(false);
    } else {
      console.log("Starting speech");
      await Speech.stop();
      setPlaying(true);
      setTimeout(() => {
        speakCurrentChunk();
      }, 100);
    }
  };

  const increaseSpeed = () => {
    setSpeed((prevSpeed) => {
      const newSpeed = prevSpeed < 2.0 ? prevSpeed + 0.25 : 1.0;
      console.log(`Speed changed to ${newSpeed.toFixed(2)}x`);
      return newSpeed;
    });
  };

  const restart = () => {
    console.log("Restarting speech from beginning");
    Speech.stop();
    setCurrentChunk(0);
    setTimeout(() => {
      if (playing) {
        speakCurrentChunk();
      }
    }, 100);
  };

  const skipForward = () => {
    if (currentChunk < textChunks.length - 1) {
      console.log("Skipping to next chunk");
      Speech.stop();
      setCurrentChunk(prev => prev + 1);
      if (playing) {
        setTimeout(() => {
          speakCurrentChunk();
        }, 100);
      }
    } else {
      console.log("Already at last chunk");
    }
  };

  return (
    <View style={styles.box}>
      <TouchableOpacity style={styles.voice} onPress={() => router.push("/voices/selectVoice")}>
        <View style={styles.voiceImg}>
          <Image source={Pic} style={styles.Img} />
        </View>
        <Text style={styles.voiceTxt}>Voices</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.voice} onPress={restart}>
        <FontAwesome6 name="rotate-left" size={22} color="#9E9898" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.voiceBtn} onPress={speak}>
        {playing ? (
          <FontAwesome name="pause" size={29} color="white" />
        ) : (
          <FontAwesome name="play" size={22} color="white" />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.voice} onPress={skipForward}>
        <FontAwesome6 name="rotate-right" size={22} color="#9E9898" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.voice} onPress={increaseSpeed}>
        <View style={styles.voiceImg}>
          <Text style={styles.voiceTxt}>{speed.toFixed(2)}x</Text>
        </View>
        <Text style={styles.voiceTxt}>Speed</Text>
      </TouchableOpacity>
    </View>
  );
};
// https://dpc-mmstts.hf.space/
// import { client } from "@gradio/client";

// const app = await client("https://dpc-mmstts.hf.space/");
// const result = await app.predict("/predict", [		
// 				"Howdy!", // string  in 'Input text (unlimited sentences)' Textbox component		
// 				"Burmese (mya)", // string (Option from: ['Burmese (mya)', 'Mon (mnw)', 'Shan (shn)', 'English (eng)', 'Vietnamese (vie)', 'Thai (tha)', 'Thai, Northern (nod)', 'Indonesian (ind)', 'Khmer (khm)', 'Khmer, Northern (kxm)', 'Abidji (abi)', 'Aceh (ace)', 'Achagua (aca)', 'Achang (acn)', 'Achi (acr)', 'Acholi (ach)', 'Achuar-Shiwiar (acu)', 'Aché (guq)', 'Adele (ade)', 'Adioukrou (adj)', 'Agarabi (agd)', 'Aghul (agx)', 'Agutaynen (agn)', 'Ahanta (aha)', 'Akan (aka)', 'Akateko (knj)', 'Akawaio (ake)', 'Akeu (aeu)', 'Akha (ahk)', 'Akoose (bss)', 'Alangan (alj)', 'Albanian (sqi)', 'Altai, Southern (alt)', 'Alune (alp)', 'Alur (alz)', 'Amazigh (kab)', 'Ambai (amk)', 'Ambrym, North (mmg)', 'Amharic (amh)', 'Amis (ami)', 'Amuzgo, San Pedro Amuzgos (azg)', 'Angor (agg)', 'Anjam (boj)', 'Anufo (cko)', 'Anyin (any)', 'Arabela (arl)', 'Arabic (ara)', 'Aralle-Tabulahan (atq)', 'Aringa (luc)', 'Armenian, Western (hyw)', 'Arop-Lokep (apr)', 'Arosi (aia)', 'Aruamu (msy)', 'Asháninka (cni)', 'Ashéninka, Pajonal (cjo)', 'Ashéninka, Pichis (cpu)', 'Ashéninka, Ucayali-Yurúa (cpb)', 'Assamese (asm)', 'Asu (asa)', 'Ateso (teo)', 'Attié (ati)', 'Aukan (djk)', 'Avar (ava)', 'Avatime (avn)', 'Avokaya (avu)', 'Awa (awb)', 'Awa-Cuaiquer (kwi)', 'Awadhi (awa)', 'Awajún (agr)', 'Awakateko (agu)', 'Aymara, Central (ayr)', 'Ayoreo (ayo)', 'Ayta, Abellen (abp)', 'Ayta, Mag-Indi (blx)', 'Ayta, Mag-antsi (sgb)', 'Azerbaijani, North (azj-script_cyrillic)', 'Azerbaijani, North (azj-script_latin)', 'Azerbaijani, South (azb)', 'Baatonum (bba)', 'Bada (bhz)', 'Baelelea (bvc)', 'Bagheli (bfy)', 'Bagri (bgq)', 'Bahnar (bdq)', 'Baka (bdh)', 'Bakhtiâri (bqi)', 'Bakwé (bjw)', 'Balantak (blz)', 'Bali (ban)', 'Balochi, Southern (bcc-script_latin)', 'Balochi, Southern (bcc-script_arabic)', 'Bamanankan (bam)', 'Bambam (ptu)', 'Bana (bcw)', 'Bandial (bqj)', 'Bantoanon (bno)', 'Barai (bbb)', 'Bari (bfa)', 'Baruga (bjz)', 'Bashkort (bak)', 'Basque (eus)', 'Bassa (bsq)', 'Batak Angkola (akb)', 'Batak Dairi (btd)', 'Batak Karo (btx)', 'Batak Simalungun (bts)', 'Batak Toba (bbc)', 'Bauzi (bvz)', 'Bedjond (bjv)', 'Behoa (bep)', 'Bekwarra (bkv)', 'Belize English Creole (bzj)', 'Bemba (bem)', 'Benga (bng)', 'Bengali (ben)', 'Berom (bom)', 'Bete-Bendi (btt)', 'Bharia (bha)', 'Bhatri (bgw)', 'Bhattiyali (bht)', 'Biali (beh)', 'Bidayuh, Bau (sne)', 'Bikol, Buhi’non (ubl)', 'Bikol, Central (bcl)', 'Bimoba (bim)', 'Binukid (bkd)', 'Binumarien (bjr)', 'Birifor, Malba (bfo)', 'Birifor, Southern (biv)', 'Bisa (bib)', 'Bislama (bis)', 'Bisu (bzi)', 'Bisã (bqp)', 'Blaan, Koronadal (bpr)', 'Blaan, Sarangani (bps)', 'Bobo Madaré, Southern (bwq)', 'Bodo Parja (bdv)', 'Boko (bqc)', 'Bokobaru (bus)', 'Bola (bnp)', 'Bomu (bmq)', 'Bonggi (bdg)', 'Bora (boa)', 'Borong (ksr)', 'Borôro (bor)', 'Bru, Eastern (bru)', 'Buamu (box)', 'Buang, Mapos (bzh)', 'Bughotu (bgt)', 'Buglere (sab)', 'Bulgarian (bul)', 'Buli (bwu)', 'Bum (bmv)', 'Bwanabwana (tte)', 'Cabécar (cjp)', 'Cacua (cbv)', 'Capanahua (kaq)', 'Caquinte (cot)', 'Carapana (cbc)', 'Carib (car)', 'Catalan (cat)', 'Cebuano (ceb)', 'Cerma (cme)', 'Chachi (cbi)', 'Chamacoco (ceg)', 'Chatino, Eastern Highland (cly)', 'Chatino, Nopala (cya)', 'Chechen (che)', 'Chhattisgarhi (hne)', 'Chichewa (nya)', 'Chidigo (dig)', 'Chiduruma (dug)', 'Chin, Bawm (bgr)', 'Chin, Eastern Khumi (cek)', 'Chin, Falam (cfm)', 'Chin, Hakha (cnh)', 'Chin, Matu (hlt)', 'Chin, Müün (mwq)', 'Chin, Tedim (ctd)', 'Chin, Thado (tcz)', 'Chin, Zyphe (zyp)', 'Chinantec, Comaltepec (cco)', 'Chinantec, Lalana (cnl)', 'Chinantec, Lealao (cle)', 'Chinantec, Ozumacín (chz)', 'Chinantec, Palantla (cpa)', 'Chinantec, Sochiapam (cso)', 'Chinantec, Tepetotutla (cnt)', 'Chinantec, Usila (cuc)', 'Chinese, Hakka (hak)', 'Chinese, Min Nan (nan)', 'Chingoni (xnj)', 'Chipaya (cap)', 'Chiquitano (cax)', 'Chittagonian (ctg)', 'Chol (ctu)', 'Chontal, Tabasco (chf)', 'Chopi (cce)', 'Chorote, Iyojwa’ja (crt)', 'Chorote, Iyo’wujwa (crq)', 'Chuj (cac-dialect_sansebastiáncoatán)', 'Chuj (cac-dialect_sanmateoixtatán)', 'Chukchi (ckt)', 'Chumburung (ncu)', 'Churahi (cdj)', 'Chuvash (chv)', 'Ch’orti’ (caa)', 'Cishingini (asg)', 'Cofán (con)', 'Cora, El Nayar (crn)', 'Cora, Santa Teresa (cok)', 'Cree, Plains (crk-script_latin)', 'Cree, Plains (crk-script_syllabics)', 'Crimean Tatar (crh)', 'Cuiba (cui)', 'Daasanach (dsh)', 'Daba (dbq)', 'Dagaare, Southern (dga)', 'Dagara, Northern (dgi)', 'Dagba (dgk)', 'Dan (dnj-dialect_gweetaawueast)', 'Dan (dnj-dialect_blowowest)', 'Dangaléat (daa)', 'Dani, Mid Grand Valley (dnt)', 'Dani, Western (dnw)', 'Dargwa (dar)', 'Datooga (tcc)', 'Dawro (dwr)', 'Dedua (ded)', 'Deg (mzw)', 'Delo (ntr)', 'Dendi (ddn)', 'Desano (des)', 'Desiya (dso)', 'Dhao (nfa)', 'Dhimal (dhi)', 'Dida, Yocoboué (gud)', 'Didinga (did)', 'Digaro-Mishmi (mhu)', 'Dinka, Northeastern (dip)', 'Dinka, Southwestern (dik)', 'Ditammari (tbz)', 'Dogon, Toro So (dts)', 'Dogosé (dos)', 'Dogri (dgo)', 'Duri (mvp)', 'Dutch (nld)', 'Dza (jen)', 'Dzongkha (dzo)', 'Ede Idaca (idd)', 'Ekajuk (eka)', 'Embera Catío (cto)', 'Emberá, Northern (emp)', 'Enxet (enx)', 'Epena (sja)', 'Erzya (myv)', 'Ese (mcq)', 'Ese Ejja (ese)', 'Evenki (evn)', 'Ezaa (eza)', 'Fali, South (fal)', 'Faroese (fao)', 'Fataleka (far)', 'Fijian (fij)', 'Finnish (fin)', 'Fon (fon)', 'Fordata (frd)', 'French (fra)', 'Fulah (ful)', 'Fuliiru (flr)', 'Gadaba, Mudhili (gau)', 'Gaddi (gbk)', 'Gagauz (gag-script_cyrillic)', 'Gagauz (gag-script_latin)', 'Galela (gbi)', 'Gamo (gmv)', 'Ganda (lug)', 'Gapapaiwa (pwg)', 'Garhwali (gbm)', 'Garifuna (cab)', 'Garo (grt)', 'Gbaya (krs)', 'Gbaya, Southwest (gso)', 'Gela (nlg)', 'Gen (gej)', 'German, Standard (deu)', 'Ghari (gri)', 'Gikuyu (kik)', 'Gikyode (acd)', 'Gilaki (glk)', 'Gofa (gof-script_latin)', 'Gogo (gog)', 'Gokana (gkn)', 'Gondi, Adilabad (wsg)', 'Gonja (gjn)', 'Gor (gqr)', 'Gorontalo (gor)', 'Gourmanchéma (gux)', 'Grebo, Northern (gbo)', 'Greek (ell)', 'Greek, Ancient (grc)', 'Guahibo (guh)', 'Guajajára (gub)', 'Guarani (grn)', 'Guarayu (gyr)', 'Guayabero (guo)', 'Gude (gde)', 'Gujarati (guj)', 'Gulay (gvl)', 'Gumuz (guk)', 'Gungu (rub)', 'Gwahatike (dah)', 'Gwere (gwr)', 'Gwich’in (gwi)', 'Haitian Creole (hat)', 'Halbi (hlb)', 'Hamer-Banna (amf)', 'Hanga (hag)', 'Hanunoo (hnn)', 'Haryanvi (bgc)', 'Hatam (had)', 'Hausa (hau)', 'Hawaii Pidgin (hwc)', 'Hawu (hvn)', 'Haya (hay)', 'Hdi (xed)', 'Hebrew (heb)', 'Hehe (heh)', 'Hiligaynon (hil)', 'Hindi (hin)', 'Hindi, Fiji (hif)', 'Hindustani, Sarnami (hns)', 'Ho (hoc)', 'Holiya (hoy)', 'Huastec (hus-dialect_westernpotosino)', 'Huastec (hus-dialect_centralveracruz)', 'Huave, San Mateo del Mar (huv)', 'Huli (hui)', 'Hungarian (hun)', 'Hupla (hap)', 'Iban (iba)', 'Icelandic (isl)', 'Ida’an (dbj)', 'Ifugao, Amganad (ifa)', 'Ifugao, Batad (ifb)', 'Ifugao, Mayoyao (ifu)', 'Ifugao, Tuwali (ifk)', 'Ifè (ife)', 'Ignaciano (ign)', 'Ika (ikk)', 'Ikwo (iqw)', 'Ila (ilb)', 'Ilocano (ilo)', 'Imbongu (imo)', 'Inga (inb)', 'Ipili (ipi)', 'Iraqw (irk)', 'Islander English Creole (icr)', 'Itawit (itv)', 'Itelmen (itl)', 'Ivbie North-Okpela-Arhe (atg)', 'Ixil (ixl-dialect_sanjuancotzal)', 'Ixil (ixl-dialect_sangasparchajul)', 'Ixil (ixl-dialect_santamarianebaj)', 'Iyo (nca)', 'Izere (izr)', 'Izii (izz)', 'Jakalteko (jac)', 'Jamaican English Creole (jam)', 'Javanese (jav)', 'Javanese, Suriname (jvn)', 'Jingpho (kac)', 'Jola-Fonyi (dyo)', 'Jola-Kasa (csk)', 'Jopadhola (adh)', 'Juang (jun)', 'Jukun Takum (jbu)', 'Jula (dyu)', 'Jur Modo (bex)', 'Juray (juy)', 'Kaansa (gna)', 'Kaapor (urb)', 'Kabiyè (kbp)', 'Kabwa (cwa)', 'Kadazan Dusun (dtp)', 'Kafa (kbr)', 'Kagayanen (cgc)', 'Kagulu (kki)', 'Kaili, Da’a (kzf)', 'Kaili, Ledo (lew)', 'Kakataibo-Kashibo (cbr)', 'Kako (kkj)', 'Kakwa (keo)', 'Kalagan (kqe)', 'Kalanguya (kak)', 'Kalinga, Butbut (kyb)', 'Kalinga, Lubuagan (knb)', 'Kalinga, Majukayang (kmd)', 'Kalinga, Tanudan (kml)', 'Kallahan, Keley-i (ify)', 'Kalmyk-Oirat (xal)', 'Kamano (kbq)', 'Kamayurá (kay)', 'Kambaata (ktb)', 'Kamwe (hig)', 'Kandawo (gam)', 'Kandozi-Chapra (cbu)', 'Kangri (xnr)', 'Kanite (kmu)', 'Kankanaey (kne)', 'Kannada (kan)', 'Kanuri, Manga (kby)', 'Kapampangan (pam)', 'Kaqchikel (cak-dialect_santamaríadejesús)', 'Kaqchikel (cak-dialect_southcentral)', 'Kaqchikel (cak-dialect_yepocapa)', 'Kaqchikel (cak-dialect_western)', 'Kaqchikel (cak-dialect_santodomingoxenacoj)', 'Kaqchikel (cak-dialect_central)', 'Karaboro, Eastern (xrb)', 'Karachay-Balkar (krc)', 'Karakalpak (kaa)', 'Karelian (krl)', 'Karen, Pwo Northern (pww)', 'Kasem (xsm)', 'Kashinawa (cbs)', 'Kaulong (pss)', 'Kawyaw (kxf)', 'Kayabí (kyz)', 'Kayah, Western (kyu)', 'Kayapó (txu)', 'Kazakh (kaz)', 'Kebu (ndp)', 'Keliko (kbo)', 'Kenga (kyq)', 'Kenyang (ken)', 'Kera (ker)', 'Ketengban (xte)', 'Keyagana (kyg)', 'Khakas (kjh)', 'Khanty (kca)', 'Khmu (kjg)', 'Kigiryama (nyf)', 'Kilivila (kij)', 'Kim (kia)', 'Kimaragang (kqr)', 'Kimré (kqp)', 'Kinaray-a (krj)', 'Kinga (zga)', 'Kinyarwanda (kin)', 'Kipfokomo (pkb)', 'Kire (geb)', 'Kiribati (gil)', 'Kisar (kje)', 'Kisi, Southern (kss)', 'Kitharaka (thk)', 'Klao (klu)', 'Klon (kyo)', 'Kogi (kog)', 'Kolami, Northwestern (kfb)', 'Komi-Zyrian (kpv)', 'Konabéré (bbo)', 'Konkomba (xon)', 'Konni (kma)', 'Kono (kno)', 'Konso (kxc)', 'Koonzime (ozm)', 'Koorete (kqy)', 'Korean (kor)', 'Koreguaje (coe)', 'Korupun-Sela (kpq)', 'Koryak (kpy)', 'Kouya (kyf)', 'Koya (kff-script_telugu)', 'Krio (kri)', 'Kriol (rop)', 'Krumen, Plapo (ktj)', 'Krumen, Tepo (ted)', 'Krung (krr)', 'Kuay (kdt)', 'Kukele (kez)', 'Kulina (cul)', 'Kulung (kle)', 'Kumam (kdi)', 'Kuman (kue)', 'Kumyk (kum)', 'Kuna, Border (kvn)', 'Kuna, San Blas (cuk)', 'Kunda (kdn)', 'Kuo (xuo)', 'Kupia (key)', 'Kupsapiiny (kpz)', 'Kuranko (knk)', 'Kurdish, Northern (kmr-script_latin)', 'Kurdish, Northern (kmr-script_arabic)', 'Kurdish, Northern (kmr-script_cyrillic)', 'Kurumba, Alu (xua)', 'Kurux (kru)', 'Kusaal (kus)', 'Kutep (kub)', 'Kutu (kdc)', 'Kuvi (kxv)', 'Kuwaa (blh)', 'Kuwaataay (cwt)', 'Kwaio (kwd)', 'Kwamera (tnk)', 'Kwara’ae (kwf)', 'Kwere (cwe)', 'Kyaka (kyc)', 'Kyanga (tye)', 'Kyrgyz (kir)', 'K’iche’ (quc-dialect_north)', 'K’iche’ (quc-dialect_east)', 'K’iche’ (quc-dialect_central)', 'Lacandon (lac)', 'Lacid (lsi)', 'Ladakhi (lbj)', 'Lahu (lhu)', 'Lama (las)', 'Lamba (lam)', 'Lamnso’ (lns)', 'Lampung Api (ljp)', 'Lango (laj)', 'Lao (lao)', 'Latin (lat)', 'Latvian (lav)', 'Lauje (law)', 'Lawa, Western (lcp)', 'Laz (lzz)', 'Lele (lln)', 'Lelemi (lef)', 'Lesser Antillean French Creole (acf)', 'Lewo (lww)', 'Lhao Vo (mhx)', 'Lik (eip)', 'Limba, West-Central (lia)', 'Limbu (lif)', 'Lingao (onb)', 'Lisu (lis)', 'Lobala (loq)', 'Lobi (lob)', 'Lokaa (yaz)', 'Loko (lok)', 'Lole (llg)', 'Lolopo (ycl)', 'Loma (lom)', 'Lomwe (ngl)', 'Lomwe, Malawi (lon)', 'Luang (lex)', 'Lugbara (lgg)', 'Luguru (ruf)', 'Lukpa (dop)', 'Lundayeh (lnd)', 'Lutos (ndy)', 'Luwo (lwo)', 'Lyélé (lee)', 'Maan (mev)', 'Mabaan (mfz)', 'Machame (jmc)', 'Macuna (myy)', 'Macushi (mbc)', 'Mada (mda)', 'Madura (mad)', 'Magahi (mag)', 'Mai Brat (ayz)', 'Maithili (mai)', 'Maka (mca)', 'Makaa (mcp)', 'Makasar (mak)', 'Makhuwa (vmw)', 'Makhuwa-Meetto (mgh)', 'Makonde (kde)', 'Malagasy (mlg)', 'Malay (zlm)', 'Malay, Central (pse)', 'Malay, Kupang (mkn)', 'Malay, Manado (xmm)', 'Malayalam (mal)', 'Malayic Dayak (xdy)', 'Maldivian (div)', 'Male (mdy)', 'Malvi (mup)', 'Mam (mam-dialect_central)', 'Mam (mam-dialect_northern)', 'Mam (mam-dialect_southern)', 'Mam (mam-dialect_western)', 'Mamasa (mqj)', 'Mambila, Cameroon (mcu)', 'Mambila, Nigeria (mzk)', 'Mampruli (maw)', 'Mandeali (mjl)', 'Mandinka (mnk)', 'Mango (mge)', 'Mangseng (mbh)', 'Mankanya (knf)', 'Mannan (mjv)', 'Manobo, Matigsalug (mbt)', 'Manobo, Obo (obo)', 'Manobo, Western Bukidnon (mbb)', 'Manya (mzj)', 'Mapun (sjm)', 'Maranao (mrw)', 'Marathi (mar)', 'Marba (mpg)', 'Mari, Meadow (mhr)', 'Markweeta (enb)', 'Marshallese (mah)', 'Masaaba (myx)', 'Maskelynes (klv)', 'Matal (mfh)', 'Mato (met)', 'Matsigenka (mcb)', 'Maya, Mopán (mop)', 'Maya, Yucatec (yua)', 'Mayo (mfy)', 'Mazahua, Central (maz)', 'Mazatec, Ayautla (vmy)', 'Mazatec, Chiquihuitlán (maq)', 'Mazatec, Ixcatlán (mzi)', 'Mazatec, Jalapa de Díaz (maj)', 'Mazatec, San Jerónimo Tecóatl (maa-dialect_sanantonio)', 'Mazatec, San Jerónimo Tecóatl (maa-dialect_sanjerónimo)', 'Ma’anyan (mhy)', 'Ma’di (mhi)', 'Mbandja (zmz)', 'Mbay (myb)', 'Mbore (gai)', 'Mbuko (mqb)', 'Mbula-Bwazza (mbu)', 'Melpa (med)', 'Mende (men)', 'Mengen (mee)', 'Mentawai (mwv)', 'Merey (meq)', 'Mesme (zim)', 'Meta’ (mgo)', 'Meyah (mej)', 'Migabac (mpp)', 'Minangkabau (min)', 'Misak (gum)', 'Misima-Panaeati (mpx)', 'Mixe, Coatlán (mco)', 'Mixe, Juquila (mxq)', 'Mixe, Quetzaltepec (pxm)', 'Mixe, Totontepec (mto)', 'Mixtec, Alacatlatzala (mim)', 'Mixtec, Alcozauca (xta)', 'Mixtec, Amoltepec (mbz)', 'Mixtec, Apasco-Apoala (mip)', 'Mixtec, Atatlahuca (mib)', 'Mixtec, Ayutla (miy)', 'Mixtec, Chayuco (mih)', 'Mixtec, Coatzospan (miz)', 'Mixtec, Diuxi-Tilantongo (xtd)', 'Mixtec, Jamiltepec (mxt)', 'Mixtec, Magdalena Peñasco (xtm)', 'Mixtec, Metlatónoc (mxv)', 'Mixtec, Northern Tlaxiaco (xtn)', 'Mixtec, Ocotepec (mie)', 'Mixtec, Peñoles (mil)', 'Mixtec, Pinotepa Nacional (mio)', 'Mixtec, Santa Lucía Monteverde (mdv)', 'Mixtec, Santa María Zacatepec (mza)', 'Mixtec, Southern Puebla (mit)', 'Mixtec, Tezoatlán (mxb)', 'Mixtec, Yosondúa (mpm)', 'Miyobe (soy)', 'Mnong, Central (cmo-script_latin)', 'Mnong, Central (cmo-script_khmer)', 'Moba (mfq)', 'Mochi (old)', 'Mofu, North (mfk)', 'Mofu-Gudur (mif)', 'Mokole (mkl)', 'Molima (mox)', 'Moma (myl)', 'Momuna (mqf)', 'Mongolian (mon)', 'Mongondow (mog)', 'Morisyen (mfe)', 'Moro (mor)', 'Moronene (mqn)', 'Moru (mgd)', 'Moskona (mtj)', 'Mro-Khimi (cmr)', 'Mualang (mtd)', 'Muinane (bmr)', 'Mukulu (moz)', 'Mumuye (mzm)', 'Muna (mnb)', 'Mundani (mnf)', 'Mundari (unr)', 'Muria, Far Western (fmu)', 'Murle (mur)', 'Murut, Timugon (tih)', 'Muthuvan (muv)', 'Muyang (muy)', 'Mwaghavul (sur)', 'Mwan (moa)', 'Mwani (wmw)', 'Ménik (tnr)', 'Mískito (miq)', 'Mòoré (mos)', 'Mündü (muh)', 'Naasioi (nas)', 'Nadëb (mbj)', 'Nafaanra (nfr)', 'Naga, Kharam (kfw)', 'Naga, Tangshang (nst)', 'Nagamese (nag)', 'Nahuatl, Central Huasteca (nch)', 'Nahuatl, Eastern Huasteca (nhe)', 'Nahuatl, Guerrero (ngu)', 'Nahuatl, Highland Puebla (azz)', 'Nahuatl, Isthmus-Mecayapan (nhx)', 'Nahuatl, Michoacán (ncl)', 'Nahuatl, Northern Oaxaca (nhy)', 'Nahuatl, Northern Puebla (ncj)', 'Nahuatl, Sierra Negra (nsu)', 'Nahuatl, Southeastern Puebla (npl)', 'Nahuatl, Tlamacazapa (nuz)', 'Nahuatl, Western Huasteca (nhw)', 'Nahuatl, Zacatlán-Ahuacatlán-Tepetzintla (nhi)', 'Nalca (nlc)', 'Nambikuára, Southern (nab)', 'Nanai (gld)', 'Nande (nnb)', 'Napu (npy)', 'Nasa (pbb)', 'Nateni (ntm)', 'Nawdm (nmz)', 'Nawuri (naw)', 'Naxi (nxq)', 'Ndamba (ndj)', 'Ndogo (ndz)', 'Ndut (ndv)', 'Newar (new)', 'Ngaju (nij)', 'Ngambay (sba)', 'Ngangam (gng)', 'Ngbaka (nga)', 'Ngindo (nnq)', 'Ngulu (ngp)', 'Ngäbere (gym)', 'Ng’akarimojong (kdj)', 'Nias (nia)', 'Nilamba (nim)', 'Ninzo (nin)', 'Nkonya (nko)', 'Nogai (nog)', 'Nomaande (lem)', 'Nomatsigenga (not)', 'Noone (nhu)', 'Ntcham (bud)', 'Nuer (nus)', 'Nugunu (yas)', 'Nuni, Southern (nnw)', 'Nyabwa (nwb)', 'Nyakyusa-Ngonde (nyy)', 'Nyankore (nyn)', 'Nyaturu (rim)', 'Nyindrou (lid)', 'Nyole (nuj)', 'Nyoro (nyo)', 'Nzema (nzi)', 'Obolo (ann)', 'Odia (ory)', 'Ojibwa, Northwestern (ojb-script_latin)', 'Ojibwa, Northwestern (ojb-script_syllabics)', 'Oku (oku)', 'Oniyan (bsc)', 'Oroko (bdu)', 'Oromo (orm)', 'Orya (ury)', 'Ossetic (oss)', 'Otomi, Mezquital (ote)', 'Otomi, Querétaro (otq)', 'Owa (stn)', 'Paasaal (sig)', 'Pahari, Kullu (kfx)', 'Pahari, Mahasu (bfz)', 'Paicoca (sey)', 'Paiute, Northern (pao)', 'Palauan (pau)', 'Palaung, Ruching (pce)', 'Palawano, Brooke’s Point (plw)', 'Pamona (pmf)', 'Pangasinan (pag)', 'Papiamentu (pap)', 'Paranan (prf)', 'Parecís (pab)', 'Parkwa (pbi)', 'Patamona (pbc)', 'Paumarí (pad)', 'Pele-Ata (ata)', 'Penan, Eastern (pez)', 'Pengo (peg)', 'Persian (fas)', 'Pidgin, Nigerian (pcm)', 'Pijin (pis)', 'Pinyin (pny)', 'Piratapuyo (pir)', 'Pitjantjatjara (pjt)', 'Pogolo (poy)', 'Polish (pol)', 'Popoloca, San Luís Temalacayuca (pps)', 'Popoloca, San Marcos Tlacoyalco (pls)', 'Popoluca, Highland (poi)', 'Poqomchi’ (poh-dialect_eastern)', 'Poqomchi’ (poh-dialect_western)', 'Portuguese (por)', 'Prai (prt)', 'Puinave (pui)', 'Punjabi, Eastern (pan)', 'Purepecha (tsz)', 'Puroik (suv)', 'Pévé (lme)', 'Quechua, Ayacucho (quy)', 'Quechua, Cajamarca (qvc)', 'Quechua, Cusco (quz)', 'Quechua, Eastern Apurímac (qve)', 'Quechua, Huallaga (qub)', 'Quechua, Huamalíes-Dos de Mayo Huánuco (qvh)', 'Quechua, Huaylas Ancash (qwh)', 'Quechua, Huaylla Wanca (qvw)', 'Quechua, Lambayeque (quf)', 'Quechua, Margos-Yarowilca-Lauricocha (qvm)', 'Quechua, North Bolivian (qul)', 'Quechua, North Junín (qvn)', 'Quechua, Northern Conchucos Ancash (qxn)', 'Quechua, Panao (qxh)', 'Quechua, San Martín (qvs)', 'Quechua, South Bolivian (quh)', 'Quechua, Southern Conchucos (qxo)', 'Quichua, Cañar Highland (qxr)', 'Quichua, Napo (qvo)', 'Quichua, Northern Pastaza (qvz)', 'Quichua, Salasaca Highland (qxl)', 'Quichua, Tena Lowland (quw)', 'Q’anjob’al (kjb)', 'Q’eqchi’ (kek)', 'Rabha (rah)', 'Rajbanshi (rjs)', 'Ramoaaina (rai)', 'Rampi (lje)', 'Ranglong (rnl)', 'Rangpuri (rkt)', 'Rapa Nui (rap)', 'Ravula (yea)', 'Rawang (raw)', 'Rejang (rej)', 'Rendille (rel)', 'Riang Lang (ril)', 'Rigwe (iri)', 'Rikou (rgu)', 'Rohingya (rhg)', 'Romani, Carpathian (rmc-script_latin)', 'Romani, Carpathian (rmc-script_cyrillic)', 'Romani, Sinte (rmo)', 'Romani, Vlax (rmy-script_latin)', 'Romani, Vlax (rmy-script_cyrillic)', 'Romanian (ron)', 'Romblomanon (rol)', 'Ron (cla)', 'Ronga (rng)', 'Roviana (rug)', 'Rundi (run)', 'Russian (rus)', 'Saamya-Gwe (lsm)', 'Sabaot (spy)', 'Sadri (sck)', 'Sahu (saj)', 'Sakachep (sch)', 'Sama, Central (sml)', 'Sambal (xsb)', 'Sambal, Botolan (sbl)', 'Samburu (saq)', 'Samo, Southern (sbd)', 'Samoan (smo)', 'Sampang (rav)', 'Sangir (sxn)', 'Sango (sag)', 'Sangu (sbp)', 'Sanumá (xsu)', 'Saramaccan (srm)', 'Sasak (sas)', 'Sa’a (apb)', 'Sebat Bet Gurage (sgw)', 'Sedoa (tvw)', 'Sekpele (lip)', 'Selaru (slu)', 'Selee (snw)', 'Semai (sea)', 'Semelai (sza)', 'Sena (seh)', 'Seychelles French Creole (crs)', 'Shambala (ksb)', 'Shanga (sho)', 'Sharanahua (mcd)', 'Shawi (cbt)', 'Sherpa (xsr)', 'Shilluk (shk)', 'Shipibo-Conibo (shp)', 'Shona (sna)', 'Shor (cjs)', 'Shuar (jiv)', 'Siane (snp)', 'Siang (sya)', 'Sidamo (sid)', 'Siona (snn)', 'Siriano (sri)', 'Sirmauri (srx)', 'Sisaala, Tumulung (sil)', 'Sissala (sld)', 'Siwu (akp)', 'Soga (xog)', 'Somali (som)', 'Somba-Siawari (bmu)', 'Songhay, Koyra Chiini (khq)', 'Songhay, Koyraboro Senni (ses)', 'Sougb (mnx)', 'Spanish (spa)', 'Sranan Tongo (srn)', 'Suba (sxb)', 'Subanon, Western (suc)', 'Sudest (tgo)', 'Sukuma (suk)', 'Sunda (sun)', 'Sunwar (suz)', 'Surgujia (sgj)', 'Susu (sus)', 'Swahili (swh)', 'Swedish (swe)', 'Sylheti (syl)', 'Sénoufo, Djimini (dyi)', 'Sénoufo, Mamara (myk)', 'Sénoufo, Supyire (spp)', 'Taabwa (tap)', 'Tabaru (tby)', 'Tacana (tna)', 'Tachelhit (shi)', 'Tado (klw)', 'Tagalog (tgl)', 'Tagbanwa, Calamian (tbk)', 'Tagin (tgj)', 'Tai Dam (blt)', 'Tairora, North (tbg)', 'Tairora, South (omw)', 'Tajik (tgk)', 'Tajio (tdj)', 'Takia (tbc)', 'Talinga-Bwisi (tlj)', 'Talysh (tly)', 'Tamajaq, Tawallammat (ttq-script_tifinagh)', 'Tamang, Eastern (taj)', 'Tamasheq (taq)', 'Tamil (tam)', 'Tampulma (tpm)', 'Tangoa (tgp)', 'Tanna, North (tnn)', 'Tarahumara, Western (tac)', 'Tarifit (rif-script_latin)', 'Tarifit (rif-script_arabic)', 'Tatar (tat)', 'Tatuyo (tav)', 'Tawbuid (twb)', 'Tboli (tbl)', 'Tehit (kps)', 'Teiwa (twe)', 'Tektiteko (ttc)', 'Telugu (tel)', 'Tem (kdh)', 'Tengger (tes)', 'Tennet (tex)', 'Tepehua, Huehuetla (tee)', 'Tepehua, Pisaflores (tpp)', 'Tepehua, Tlachichilco (tpt)', 'Tepehuan, Southeastern (stp)', 'Teribe (tfr)', 'Termanu (twu)', 'Terêna (ter)', 'Tewa (tew)', 'Tharu, Dangaura (thl)', 'Themne (tem)', 'Tibetan, Amdo (adx)', 'Tibetan, Central (bod)', 'Tibetan, Khams (khg)', 'Ticuna (tca)', 'Tigrigna (tir)', 'Tii (txq)', 'Tikar (tik)', 'Tlicho (dgr)', 'Toba (tob)', 'Toba-Maskoy (tmf)', 'Tobanga (tng)', 'Tobelo (tlb)', 'Tohono O’odham (ood)', 'Tok Pisin (tpi)', 'Tol (jic)', 'Tolaki (lbw)', 'Tombonuo (txa)', 'Tombulu (tom)', 'Tonga (toh)', 'Tontemboan (tnt)', 'Toraja-Sa’dan (sda)', 'Torres Strait Creole (tcs)', 'Totonac, Coyutla (toc)', 'Totonac, Highland (tos)', 'Toura (neb)', 'Trinitario (trn)', 'Triqui, Chicahuaxtla (trs)', 'Triqui, Copala (trc)', 'Trió (tri)', 'Tsafiki (cof)', 'Tsakhur (tkr)', 'Tsikimba (kdl)', 'Tsimané (cas)', 'Tsonga (tso)', 'Tucano (tuo)', 'Tuma-Irumu (iou)', 'Tumak (tmc)', 'Tunebo, Central (tuf)', 'Turkish (tur)', 'Turkmen (tuk-script_latin)', 'Turkmen (tuk-script_arabic)', 'Tuwuli (bov)', 'Tuyuca (tue)', 'Tyap (kcg)', 'Tzeltal (tzh-dialect_bachajón)', 'Tzeltal (tzh-dialect_tenejapa)', 'Tzotzil (tzo-dialect_chenalhó)', 'Tzotzil (tzo-dialect_chamula)', 'Tz’utujil (tzj-dialect_western)', 'Tz’utujil (tzj-dialect_eastern)', 'Uab Meto (aoz)', 'Udmurt (udm)', 'Uduk (udu)', 'Ukrainian (ukr)', 'Uma (ppk)', 'Umbu-Ungu (ubu)', 'Urak Lawoi’ (urk)', 'Urarina (ura)', 'Urat (urt)', 'Urdu (urd-script_devanagari)', 'Urdu (urd-script_arabic)', 'Urdu (urd-script_latin)', 'Uripiv-Wala-Rano-Atchin (upv)', 'Uspanteko (usp)', 'Uyghur (uig-script_arabic)', 'Uyghur (uig-script_cyrillic)', 'Uzbek (uzb-script_cyrillic)', 'Vagla (vag)', 'Vengo (bav)', 'Vidunda (vid)', 'Vili (vif)', 'Vunjo (vun)', 'Vute (vut)', 'Wa, Parauk (prk)', 'Waama (wwa)', 'Waima (rro)', 'Waimaha (bao)', 'Waiwai (waw)', 'Wala (lgl)', 'Wali (wlx)', 'Wamey (cou)', 'Wampís (hub)', 'Wanano (gvc)', 'Wandala (mfi)', 'Wapishana (wap)', 'Warao (wba)', 'Waray-Waray (war)', 'Wayana (way)', 'Wayuu (guc)', 'Welsh (cym)', 'Wersing (kvw)', 'Whitesands (tnp)', 'Witoto, Minika (hto)', 'Witoto, Murui (huu)', 'Wolaytta (wal-script_latin)', 'Wolaytta (wal-script_ethiopic)', 'Wolio (wlo)', 'Woun Meu (noa)', 'Wè Northern (wob)', 'Xaasongaxango (kao)', 'Xerénte (xer)', 'Yagua (yad)', 'Yakan (yka)', 'Yakut (sah)', 'Yala (yba)', 'Yali, Angguruk (yli)', 'Yali, Ninia (nlk)', 'Yalunka (yal)', 'Yamba (yam)', 'Yambeta (yat)', 'Yamdena (jmd)', 'Yami (tao)', 'Yaminahua (yaa)', 'Yanesha’ (ame)', 'Yanomamö (guu)', 'Yao (yao)', 'Yaouré (yre)', 'Yawa (yva)', 'Yemba (ybb)', 'Yine (pib)', 'Yipma (byr)', 'Yom (pil)', 'Yoruba (yor)', 'Yucuna (ycn)', 'Yupik, Saint Lawrence Island (ess)', 'Yuracare (yuz)', 'Zaiwa (atb)', 'Zande (zne)', 'Zapotec, Aloápam (zaq)', 'Zapotec, Amatlán (zpo)', 'Zapotec, Cajonos (zad)', 'Zapotec, Choapan (zpc)', 'Zapotec, Coatecas Altas (zca)', 'Zapotec, Guevea de Humboldt (zpg)', 'Zapotec, Isthmus (zai)', 'Zapotec, Lachixío (zpl)', 'Zapotec, Miahuatlán (zam)', 'Zapotec, Mitla (zaw)', 'Zapotec, Mixtepec (zpm)', 'Zapotec, Ocotlán (zac)', 'Zapotec, Ozolotepec (zao)', 'Zapotec, Quioquitani-Quierí (ztq)', 'Zapotec, Rincón (zar)', 'Zapotec, San Vicente Coatlán (zpt)', 'Zapotec, Santa María Quiegolani (zpi)', 'Zapotec, Santo Domingo Albarradas (zas)', 'Zapotec, Sierra de Juárez (zaa)', 'Zapotec, Texmelucan (zpz)', 'Zapotec, Western Tlacolula Valley (zab)', 'Zapotec, Yalálag (zpu)', 'Zapotec, Yareni (zae)', 'Zapotec, Yatee (zty)', 'Zapotec, Yatzachi (zav)', 'Zaza (zza)', 'Zhuang, Yongbei (zyb)', 'Zigula (ziw)', 'Zoque, Francisco León (zos)', 'Zulgo-Gemzek (gnd)', 'Éwé (ewe)']) in 'Select language 1,000+' Dropdown component
// 	]);

console.log(result.data);

export default TTSFunction;

const styles = StyleSheet.create({
  box: {
    height: 100,
    backgroundColor: "#fff",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  voice: {
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  voiceImg: {
    borderRadius: 30,
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: "#9E9898",
    justifyContent: "center",
    alignItems: "center",
  },
  Img: {
    borderRadius: 30,
    height: 34,
    width: 34,
  },
  voiceTxt: {
    fontWeight: "800",
    fontSize: 10,
  },
  voiceBtn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 55,
    width: 55,
    backgroundColor: "#3273F6",
  },
});








// import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from "react-native";
// import React, { useState, useEffect } from "react";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import Pic from "../assets/images/profile.jpg";
// import * as Speech from "expo-speech";
// import { Audio } from 'expo-av';
// import * as FileSystem from 'expo-file-system';
// import { router } from "expo-router";

// // Define your API URL - replace with your actual Render.com URL when deployed
// const API_URL = "https://yarngpt-api.onrender.com";

// const TTSFunction = ({ text, onBoundary }) => {
//   const [playing, setPlaying] = useState(false);
//   const [speed, setSpeed] = useState(0.8);
//   const [currentChunk, setCurrentChunk] = useState(0);
//   const [textChunks, setTextChunks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sound, setSound] = useState(null);
//   const [selectedVoice, setSelectedVoice] = useState("idera");
//   const MAX_CHUNK_SIZE = 3000; // Safe limit for most devices
  
//   // Voice options from YarnGPT (Nigerian accents)
//   const voiceOptions = [
//     "idera", "emma", "jude", "osagie", "tayo", 
//     "zainab", "joke", "regina", "remi", "umar", "chinenye"
//   ];

//   // Split text into manageable chunks on component mount or when text changes
//   useEffect(() => {
//     if (!text) {
//       setTextChunks([]);
//       return;
//     }
    
//     // Split by sentences to avoid cutting in the middle of speech
//     const sentences = text.split(/(?<=[.!?])\s+/);
//     const chunks = [];
//     let currentChunk = "";
    
//     sentences.forEach(sentence => {
//       // If adding this sentence would exceed the chunk size, start a new chunk
//       if (currentChunk.length + sentence.length > MAX_CHUNK_SIZE) {
//         if (currentChunk.length > 0) {
//           chunks.push(currentChunk);
//         }
//         currentChunk = sentence;
//       } else {
//         currentChunk += (currentChunk ? " " : "") + sentence;
//       }
//     });
    
//     // Add the last chunk if it's not empty
//     if (currentChunk.length > 0) {
//       chunks.push(currentChunk);
//     }
    
//     setTextChunks(chunks);
//     setCurrentChunk(0);
//     console.log(`Text split into ${chunks.length} chunks`);
//   }, [text]);

//   useEffect(() => {
//     // Cleanup when component unmounts
//     return () => {
//       if (sound) {
//         sound.unloadAsync();
//       }
//       Speech.stop();
//       setPlaying(false);
//     };
//   }, []);
  
//   // Choose between native TTS or YarnGPT API
//   const speak = async () => {
//     if (textChunks.length === 0) {
//       console.log("No text to speak");
//       return;
//     }
    
//     if (playing) {
//       console.log("Stopping speech");
      
//       if (sound) {
//         await sound.stopAsync();
//         setSound(null);
//       } else {
//         Speech.stop();
//       }
      
//       setPlaying(false);
//     } else {
//       console.log("Starting speech");
      
//       // Determine if we should use YarnGPT (Nigerian accent) or device TTS
//       const useYarnGPT = selectedVoice !== "device";
      
//       if (useYarnGPT) {
//         // Use YarnGPT API
//         await speakWithYarnGPT(textChunks[currentChunk]);
//       } else {
//         // Use device TTS
//         await Speech.stop();
//         setPlaying(true);
//         setTimeout(() => {
//           speakCurrentChunk();
//         }, 100);
//       }
//     }
//   };

//   const speakWithYarnGPT = async (text) => {
//     try {
//       setLoading(true);
//       setPlaying(true);
      
//       console.log(`Requesting YarnGPT TTS for: "${text.substring(0, 50)}..."`);
      
//       // Create a temporary file path for the downloaded audio
//       const fileUri = `${FileSystem.cacheDirectory}yarngpt_audio_${Date.now()}.wav`;
      
//       // Make POST request to your YarnGPT API
//       const response = await FileSystem.downloadAsync(
//         `${API_URL}/api/tts`,
//         fileUri,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           method: 'POST',
//           body: JSON.stringify({
//             text: text,
//             speaker: selectedVoice,
//             temperature: 0.1,
//             repetition_penalty: 1.1
//           }),
//         }
//       );
      
//       console.log("Download complete:", response);
      
//       if (response.status === 200) {
//         // Play the downloaded audio
//         const { sound: newSound } = await Audio.Sound.createAsync(
//           { uri: fileUri },
//           { shouldPlay: true },
//           onPlaybackStatusUpdate
//         );
        
//         setSound(newSound);
//         setLoading(false);
//       } else {
//         throw new Error(`API returned status code: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error with YarnGPT TTS:", error);
//       setLoading(false);
//       setPlaying(false);
//       Alert.alert("Error", "Failed to generate speech. Please try again later.");
//     }
//   };
  
//   const onPlaybackStatusUpdate = (status) => {
//     if (status.didJustFinish) {
//       // Sound finished playing
//       setPlaying(false);
//       setSound(null);
      
//       // Move to next chunk if we have more
//       if (currentChunk < textChunks.length - 1) {
//         setCurrentChunk(prev => prev + 1);
//         // Optionally auto-play next chunk here
//       } else {
//         // All chunks finished
//         setCurrentChunk(0);
//       }
//     }
//   };

//   const speakCurrentChunk = async () => {
//     if (textChunks.length === 0 || currentChunk >= textChunks.length) return;
    
//     try {
//       console.log(`Speaking chunk ${currentChunk + 1} of ${textChunks.length}`);
//       Speech.speak(textChunks[currentChunk], {
//         language: "en-US",
//         rate: speed,
//         pitch: 1.1,
//         onBoundary: onBoundary,
//         onDone: handleChunkFinished,
//         onStopped: () => setPlaying(false),
//         onError: (error) => {
//           console.log("Speech error:", error);
//           setPlaying(false);
//         }
//       });
//     } catch (error) {
//       console.log("Error in speech:", error);
//       setPlaying(false);
//     }
//   };
  
//   const handleChunkFinished = () => {
//     if (currentChunk < textChunks.length - 1) {
//       // More chunks to speak
//       console.log(`Chunk ${currentChunk + 1} finished, moving to next chunk`);
//       setCurrentChunk(prev => prev + 1);
//       // Small delay before starting the next chunk
//       setTimeout(() => {
//         speakCurrentChunk();
//       }, 300);
//     } else {
//       // All chunks finished
//       console.log("All chunks finished");
//       setPlaying(false);
//       setCurrentChunk(0);
//     }
//   };

//   const increaseSpeed = () => {
//     setSpeed((prevSpeed) => {
//       const newSpeed = prevSpeed < 2.0 ? prevSpeed + 0.25 : 1.0;
//       console.log(`Speed changed to ${newSpeed.toFixed(2)}x`);
//       return newSpeed;
//     });
//   };

//   const restart = () => {
//     console.log("Restarting speech from beginning");
//     if (sound) {
//       sound.stopAsync();
//       sound.unloadAsync();
//       setSound(null);
//     } else {
//       Speech.stop();
//     }
//     setCurrentChunk(0);
//     setPlaying(false);
//   };

//   const skipForward = () => {
//     if (currentChunk < textChunks.length - 1) {
//       console.log("Skipping to next chunk");
//       if (sound) {
//         sound.stopAsync();
//         sound.unloadAsync();
//         setSound(null);
//       } else {
//         Speech.stop();
//       }
//       setCurrentChunk(prev => prev + 1);
//       setPlaying(false);
//     } else {
//       console.log("Already at last chunk");
//     }
//   };
  
//   const cycleVoice = () => {
//     // Add "device" option to use the regular device TTS
//     const allOptions = [...voiceOptions, "device"];
//     const currentIndex = allOptions.indexOf(selectedVoice);
//     const nextIndex = (currentIndex + 1) % allOptions.length;
//     const newVoice = allOptions[nextIndex];
    
//     setSelectedVoice(newVoice);
//     console.log(`Voice changed to: ${newVoice}`);
    
//     // Show feedback to user
//     Alert.alert("Voice Changed", `Now using ${newVoice === "device" ? "device TTS" : `Nigerian accent (${newVoice})`}`);
//   };

//   // Rest of your component's render code here...
//   return (
//     <View style={styles.container}>
//       {/* Display current voice/speaker */}
//       <Text style={styles.voiceLabel}>
//         Voice: {selectedVoice === "device" ? "Device TTS" : `Nigerian (${selectedVoice})`}
//       </Text>
      
//       <View style={styles.controls}>
//         <TouchableOpacity onPress={restart} style={styles.button}>
//           <FontAwesome name="refresh" size={20} color="#333" />
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={speak} style={styles.mainButton}>
//           {loading ? (
//             <Text>Loading...</Text>
//           ) : playing ? (
//             <FontAwesome name="pause" size={24} color="#fff" />
//           ) : (
//             <FontAwesome name="play" size={24} color="#fff" />
//           )}
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={cycleVoice} style={styles.button}>
//           <FontAwesome name="microphone" size={20} color="#333" />
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={skipForward} style={styles.button}>
//           <FontAwesome name="step-forward" size={20} color="#333" />
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={increaseSpeed} style={styles.button}>
//           <Text style={styles.speedText}>{speed.toFixed(2)}x</Text>
//         </TouchableOpacity>
//       </View>
      
//       {/* Progress indicator */}
//       {textChunks.length > 1 && (
//         <Text style={styles.progressText}>
//           {currentChunk + 1} / {textChunks.length}
//         </Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 15,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     marginVertical: 10,
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   button: {
//     padding: 10,
//     borderRadius: 20,
//     backgroundColor: '#e0e0e0',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 40,
//     height: 40,
//   },
//   mainButton: {
//     padding: 15,
//     borderRadius: 30,
//     backgroundColor: '#4b7bec',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 60,
//     height: 60,
//   },
//   speedText: {
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   progressText: {
//     textAlign: 'center',
//     marginTop: 10,
//     color: '#666',
//   },
//   voiceLabel: {
//     textAlign: 'center',
//     marginBottom: 10,
//     fontWeight: 'bold',
//     color: '#444',
//   },
// });

// export default TTSFunction;