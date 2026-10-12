export type MigrationLayer = "human-origins" | "prehistoric" | "historical" | "modern";

export type MigrationStory = {
  id: string;
  title: string;
  titleAr: string;
  periodStart: number; // years before present; 0 means present day
  periodEnd: number;
  from: { name: string; nameAr: string; lat: number; lng: number };
  to: { name: string; nameAr: string; lat: number; lng: number };
  layer: MigrationLayer;
  category: string;
  categoryAr: string;
  summary: string;
  summaryAr: string;
  evidence: string;
  evidenceAr: string;
  confidence: "high" | "medium" | "emerging";
  color: string;
};

// Educational sample records, not a complete reconstruction of population movement.
// Dates and paths are simplified; ancient routes are hypotheses supported by multiple evidence types.
export const migrations: MigrationStory[] = [
  { id:"out-of-africa", title:"Dispersals beyond Africa", titleAr:"انتشار البشر خارج إفريقيا", periodStart:70000, periodEnd:50000, from:{name:"East Africa",nameAr:"شرق إفريقيا",lat:2,lng:37}, to:{name:"Arabian Peninsula",nameAr:"شبه الجزيرة العربية",lat:22,lng:45}, layer:"prehistoric", category:"Early human dispersal", categoryAr:"انتشار بشري مبكر", summary:"Groups of Homo sapiens moved beyond Africa in multiple episodes. The timing, routes, and extent of early dispersals remain active research questions.", summaryAr:"انتقلت جماعات من الإنسان العاقل خارج إفريقيا في مراحل متعددة. ولا يزال توقيت بعض هذه التحركات ومساراتها ومدى انتشارها موضوعًا للبحث العلمي.", evidence:"Fossils, archaeology, and genetic evidence; dates shown are approximate and do not represent a single migration event.", evidenceAr:"الأحافير والآثار والأدلة الجينية؛ التواريخ تقريبية ولا تمثل هجرة واحدة محددة.", confidence:"medium", color:"#5ce1c6" },
  { id:"sahul", title:"Movement into Sahul", titleAr:"الوصول إلى ساهول", periodStart:65000, periodEnd:45000, from:{name:"Southeast Asia",nameAr:"جنوب شرق آسيا",lat:8,lng:120}, to:{name:"Sahul (Australia–New Guinea)",nameAr:"ساهول (أستراليا وغينيا الجديدة)",lat:-16,lng:133}, layer:"prehistoric", category:"Early settlement", categoryAr:"استيطان مبكر", summary:"Human communities reached the ancient continent of Sahul, which connected Australia and New Guinea when sea levels were lower.", summaryAr:"وصلت جماعات بشرية إلى قارة ساهول القديمة التي ربطت أستراليا بغينيا الجديدة عندما كان مستوى البحر أقل.", evidence:"Archaeological sites and changing sea-level reconstructions; the precise chronology is debated.", evidenceAr:"مواقع أثرية وإعادة بناء لمستويات البحر القديمة؛ لا يزال التسلسل الزمني الدقيق محل نقاش.", confidence:"medium", color:"#5ce1c6" },
  { id:"neolithic-farming", title:"Neolithic farming expansions", titleAr:"انتشار الزراعة في العصر الحجري الحديث", periodStart:12000, periodEnd:8000, from:{name:"Fertile Crescent",nameAr:"الهلال الخصيب",lat:35,lng:38}, to:{name:"Anatolia and Europe",nameAr:"الأناضول وأوروبا",lat:45,lng:18}, layer:"prehistoric", category:"Farming & settlement", categoryAr:"الزراعة والاستقرار", summary:"Across millennia, farming practices and domesticated species spread through migration, exchange, and adoption by local communities. The process varied by region and was not a single wave.", summaryAr:"انتشرت الممارسات الزراعية والأنواع المستأنسة عبر آلاف السنين من خلال الهجرة والتبادل وتبنّي المجتمعات المحلية. واختلفت العملية من منطقة إلى أخرى ولم تكن موجة واحدة.", evidence:"Archaeobotany, archaeological sites, ancient DNA, and regional studies; dates and routes vary across areas.", evidenceAr:"علم الآثار النباتي والمواقع الأثرية والحمض النووي القديم والدراسات الإقليمية؛ تختلف التواريخ والمسارات بين المناطق.", confidence:"medium", color:"#5ce1c6" },
  { id:"bantu-expansion", title:"Bantu-language expansions", titleAr:"انتشار المجتمعات الناطقة باللغات البانتوية", periodStart:4000, periodEnd:1000, from:{name:"West-Central Africa",nameAr:"وسط غرب إفريقيا",lat:2,lng:12}, to:{name:"Southern Africa",nameAr:"جنوب إفريقيا",lat:-25,lng:28}, layer:"historical", category:"Language & farming", categoryAr:"اللغة والزراعة", summary:"Over many centuries, communities speaking Bantu languages spread across large parts of central, eastern, and southern Africa alongside complex exchanges with existing populations.", summaryAr:"على مدى قرون، انتشرت مجتمعات ناطقة باللغات البانتوية في مناطق واسعة من وسط وشرق وجنوب إفريقيا، مع تفاعلات معقدة مع السكان الموجودين.", evidence:"Linguistics, archaeology, and population genetics; this is a broad process rather than one route.", evidenceAr:"علم اللغة والآثار وعلم الوراثة السكانية؛ إنها عملية واسعة وليست مسارًا واحدًا.", confidence:"medium", color:"#a78bfa" },
  { id:"silk-road", title:"Silk Roads exchange networks", titleAr:"شبكات التبادل على طرق الحرير", periodStart:2200, periodEnd:500, from:{name:"Central Asia",nameAr:"آسيا الوسطى",lat:40,lng:67}, to:{name:"Eastern Mediterranean",nameAr:"شرق المتوسط",lat:34,lng:35}, layer:"historical", category:"Trade & mobility", categoryAr:"التجارة والتنقل", summary:"Trade routes linked communities across Eurasia, enabling the movement of merchants, craftspeople, religious traditions, technologies, and ideas.", summaryAr:"ربطت طرق التجارة مجتمعات أوراسيا، وأسهمت في تنقل التجار والحرفيين والتقاليد الدينية والتقنيات والأفكار.", evidence:"Written sources, material culture, and archaeological sites; the network changed over time.", evidenceAr:"مصادر مكتوبة ولقى مادية ومواقع أثرية؛ وقد تغيرت الشبكة عبر الزمن.", confidence:"high", color:"#a78bfa" },
  { id:"atlantic-forced", title:"Forced migration across the Atlantic", titleAr:"التهجير القسري عبر الأطلسي", periodStart:500, periodEnd:100, from:{name:"West Africa",nameAr:"غرب إفريقيا",lat:6,lng:-2}, to:{name:"Caribbean",nameAr:"الكاريبي",lat:17,lng:-72}, layer:"historical", category:"Forced displacement", categoryAr:"التهجير القسري", summary:"From the 16th to the 19th centuries, millions of Africans were forcibly transported across the Atlantic through the transatlantic slave trade.", summaryAr:"من القرن السادس عشر إلى التاسع عشر، نُقل ملايين الأفارقة قسرًا عبر الأطلسي ضمن تجارة الرقيق عبر المحيط الأطلسي.", evidence:"Extensive archival, demographic, and historical scholarship; this line is a symbolic summary of a vast network.", evidenceAr:"أبحاث أرشيفية وديموغرافية وتاريخية واسعة؛ يمثّل الخط ملخصًا رمزيًا لشبكة واسعة.", confidence:"high", color:"#fb7185" },
  { id:"modern-europe", title:"Contemporary migration to Europe", titleAr:"الهجرة المعاصرة إلى أوروبا", periodStart:35, periodEnd:0, from:{name:"North Africa & West Asia",nameAr:"شمال إفريقيا وغرب آسيا",lat:31,lng:12}, to:{name:"Southern Europe",nameAr:"جنوب أوروبا",lat:41,lng:13}, layer:"modern", category:"Contemporary migration", categoryAr:"الهجرة المعاصرة", summary:"Migration today includes work, study, family reunification, displacement, and asylum. Patterns vary by country and year.", summaryAr:"تشمل الهجرة اليوم العمل والدراسة ولمّ الشمل والنزوح وطلب اللجوء. وتختلف الأنماط حسب البلد والسنة.", evidence:"This is an illustrative connection, not a current count or a representation of every route. Add dated IOM/UN data before using quantitatively.", evidenceAr:"هذا رابط توضيحي وليس إحصاءً آنيًا أو تمثيلًا لجميع المسارات. يجب إضافة بيانات مؤرخة من المنظمة الدولية للهجرة والأمم المتحدة قبل استخدامه كميًا.", confidence:"high", color:"#fbbf24" }
];

export const layerLabels: Record<MigrationLayer, { en: string; ar: string }> = {
  "human-origins": { en:"Human origins", ar:"أصول الإنسان" },
  prehistoric: { en:"Prehistory", ar:"ما قبل التاريخ" },
  historical: { en:"Historical", ar:"الهجرات التاريخية" },
  modern: { en:"Modern era", ar:"العصر الحديث" },
};
