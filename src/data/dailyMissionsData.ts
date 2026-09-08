import { DailyMission, DailyProgressState } from '../types';
import { radwanAvatar, lailaAvatar, salamaAvatar, mansourAvatar, thothAvatar } from './gameData';

export const dailyMissions: DailyMission[] = [
  {
    dayNumber: 1,
    title: 'اليوم الأول: سر الخان المفقود وشفرة البازلت الأسود',
    subtitle: 'مهمة التحري في أزقة القاهرة الفاطمية وفك ختم حجر البازلت',
    era: 'العصر المملوكي والعثماني فوق أساسات الفراعنة',
    locationId: 'cairo',
    locationName: 'خان الخليلي، القاهرة',
    mentorName: 'العم رضوان شيخ الصاغة',
    mentorAvatar: radwanAvatar,
    associatedPuzzleId: 'cairo_cipher',
    estimatedMinutes: 25,
    completionBadge: 'مفتاح القاهرة الأثري',
    culturalWisdom: 'من تفقه في تراث الأسلاف في أزقة الخان، انفتحت له مغاليق التاريخ في صحارى الأهرام.',
    stages: [
      {
        id: 'day1_stage1',
        stageNumber: 1,
        title: 'المرحلة الأولى: فحص أزقة الخان والسبيل التاريخي',
        shortDesc: 'معاينة شواهد السبيل ودراسة حجر البازلت الأسود ذي النقوش الخفية',
        detailedInstruction: 'توجه إلى باحة خان الخليلي وافحص النقوش العثمانية وتفحص حجر البازلت الأسود واستخرج أول قرينة تاريخية.',
        actionType: 'inspect',
        targetId: 'hotspot_cairo_basalt',
        targetLocationId: 'cairo',
        locationName: 'خان الخليلي',
        objectiveSummary: 'العثور على النقش المخفي في حجر البازلت الأسود',
        historicalContext: 'حجر البازلت الأسود كان يُجلب من محاجر جبل قطران بالفيوم لحفظ النقوش من التآكل لآلاف السنين.',
      },
      {
        id: 'day1_stage2',
        stageNumber: 2,
        title: 'المرحلة الثانية: استجواب شيخ الصاغة ونقاش البردية',
        shortDesc: 'حوار معمق مع العم رضوان لكسب ثقته ومعرفة مصدر الجزء الأول من البردية',
        detailedInstruction: 'تحدث مع العم رضوان في دكانه العتيق، واختر ردود الحكمة لرفع نسبة الثقة وكشف مسار اللغز الفرعوني.',
        actionType: 'dialogue',
        targetId: 'radwan',
        targetLocationId: 'cairo',
        locationName: 'دكان العم رضوان',
        objectiveSummary: 'كسب ثقة العم رضوان والحصول على مفتاح شفرة الخرطوش',
        historicalContext: 'شيوخ حرفة الصاغة في خان الخليلي كانوا يتوارثون وثائق نادرة وخبرة في التعرف على المعادن والبرديات الأصلية.',
      },
      {
        id: 'day1_stage3',
        stageNumber: 3,
        title: 'المرحلة الثالثة: فك شفرة نقش البازلت والخرطوش الملكي',
        shortDesc: 'ترتيب الرموز الهيروغليفية المقدسة لاستخراج جزء البردية الأول',
        detailedInstruction: 'حل لغز الشفرة الهيروغليفية بترتيب رموز عين حورس وعنخ والجعران وقرص الشمس لكشف الرسالة السرية.',
        actionType: 'puzzle',
        targetId: 'cairo_cipher',
        targetLocationId: 'cairo',
        locationName: 'محراب حجر البازلت',
        objectiveSummary: 'حل اللغز واستخراج جزء البردية الأول والقرينة السرية',
        historicalContext: 'الخرطوش الملكي هو حلقة بيضاوية مقدسة كانت تحمي اسم الفرعون من قوى الشر والنسيان.',
      },
    ],
    cliffhanger: {
      dayNumber: 1,
      title: 'انطفاء مصابيح الخان وظلال المتسللين في جنح الظلام!',
      subtitle: 'نهاية مشوقة لليوم الأول • الخطر يقترب من دكان العم رضوان',
      dramaticNarrative: [
        'مع استخراج جزء البردية الأول من جوف حجر البازلت، انبعث وهج ذهبي خافت أضاء جدران الدكان القديم بنقوش طائر حورس..',
        'وفجأة، انطفأت قناديل الزيت ومصابيح خان الخليلي بصوت طقطقة مفاجئ، وخيم صمت مريب على الزقاق المزدحم عادة!',
        'تناهت إلى مسامعك ضربات عنيفة ومكتومة على الباب الخشبي العتيق، وصوت خطوات مسلحة تتربص بالخارج وتتحدث بلغة شفرات مريبة تبحث عن حامل المخطوطة!',
        'العم رضوان أمسك بذراعك بعينين تفيضان بالحذر والقلق، وفتح ممر تهريب سري خلف دولاب النحاس الأثري قائلاً: "لقد تعقبونا أسرع مما توقعت! اهرب فوراً باتجاه دروب الأزهر.. احفظ البردية بحياتك، وسنلتقي فجر الغد في قطار الصعيد المتجه للأقصر عند معبد الكرنك قبل أن تكتشف عصابة تجار الآثار وجهتنا!"',
      ],
      cliffhangerQuestion: 'من هم هؤلاء الغرباء الذين طوقوا الزقاق؟ وكيف علموا بانكسار ختم الحجر الأسود في نفس اللحظة؟',
      tomorrowPreviewTitle: 'غداً في اليوم الثاني: أسرار صالة أعمدة الكرنك وتعامد شمس طيبة',
      tomorrowPreviewTeaser: 'ستصل إلى معبد الكرنك بالأقصر لمقابلة رئيسة بعثة التنقيب المصرية د. ليلى فؤاد، وفك لغز محاذاة الشمس عبر 134 عموداً عملاقاً!',
      characterQuote: {
        speakerName: 'العم رضوان',
        speakerTitle: 'شيخ تجار خان الخليلي',
        avatar: radwanAvatar,
        quoteText: 'يا بني، ما بين يديك ليس مجرد حبر قديم، بل سر يهدد عروشاً.. خذ طريق السراديب، ونلتقي فجر الغد في طيبة إذا كان في العمر بقية!',
      },
      audioMood: 'suspense',
    },
  },

  {
    dayNumber: 2,
    title: 'اليوم الثاني: صالة أعمدة الكرنك وتعامد شمس طيبة',
    subtitle: 'مهمة التوثيق المعماري الفلكي وفك طلاسم ريشة ماعت بالأقصر',
    era: 'الدولة الحديثة - عهد العمارة الإمبراطورية العظمى (1290 ق.م)',
    locationId: 'luxor',
    locationName: 'معبد الكرنك، الأقصر',
    mentorName: 'د. ليلى فؤاد',
    mentorAvatar: lailaAvatar,
    associatedPuzzleId: 'luxor_sun_dial',
    estimatedMinutes: 30,
    completionBadge: 'صولجان الشمس الطيبي',
    culturalWisdom: 'الشمس في طيبة لا تشرق عبثاً، بل تتبع موازين ماعت الهندسية التي خطها مهندسو الملوك.',
    stages: [
      {
        id: 'day2_stage1',
        stageNumber: 1,
        title: 'المرحلة الأولى: المسح المعماري لصالة الأعمدة ومسلة حتشبسوت',
        shortDesc: 'فحص التيجان البابيرية المفتوحة وقياس زوايا الظل على الجرانيت الوردي',
        detailedInstruction: 'استكشف صالة الأعمدة الكبرى بالكرنك، وقم بفحص مسلة الملكة حتشبسوت لتوثيق أبعادها الهندسية وجمع أدلة التخريب.',
        actionType: 'evidence',
        targetId: 'card_laila_field_log',
        targetLocationId: 'luxor',
        locationName: 'صالة الأعمدة الكبرى',
        objectiveSummary: 'توثيق الهندسة المعمارية لصالة الأعمدة وتحديد ممرات النور',
        historicalContext: 'تحتوي الصالة على 134 عموداً تجسد مستنقع الخلق الأولي لنبات البردي عند الفراعنة.',
      },
      {
        id: 'day2_stage2',
        stageNumber: 2,
        title: 'المرحلة الثانية: نقاش الحكمة مع د. ليلى فؤاد',
        shortDesc: 'مناظرة أثرية وأخلاقية حول ميزان العدالة ماعت ومسار بعثة التنقيب',
        detailedInstruction: 'حاور الدكتورة ليلى فؤاد، وأثبت نزاهة مقصدك لفك لغز محكمة ماعت واستلام صولجان الشمس الذهبي.',
        actionType: 'dialogue',
        targetId: 'laila',
        targetLocationId: 'luxor',
        locationName: 'قدس أقداس معبد الكرنك',
        objectiveSummary: 'كسب ثقة رئيسة البعثة وفهم آلية تعامد الشمس',
        historicalContext: 'معبد الكرنك شُيّد بمحاذاة فلكية دقيقة مع شروق شمس الانقلاب الشتوي كل عام.',
      },
      {
        id: 'day2_stage3',
        stageNumber: 3,
        title: 'المرحلة الثالثة: لغز محاذاة أشعة الشمس الفلكية',
        shortDesc: 'توجيه حزم الضوء عبر تيجان الأعمدة لتنشيط المذبح الكهنوتي',
        detailedInstruction: 'اضبط زوايا المرايا والضوء على الأعمدة بالترتيب الفلكي الصحيح حتى يتركز الشعاع على المذبح الملكي.',
        actionType: 'puzzle',
        targetId: 'luxor_sun_dial',
        targetLocationId: 'luxor',
        locationName: 'صالة التعامد الشمسي',
        objectiveSummary: 'حل لغز المحاذاة الشمسية والحصول على صولجان قرص الشمس والقرينة الثانية',
        historicalContext: 'كان الكهنة يستخدمون شمس الظهيرة لإنارة السراديب العميقة بنظام مرايا نحاسية مصقولة.',
      },
    ],
    cliffhanger: {
      dayNumber: 2,
      title: 'انفجار السرداب الغارق ودوامة مجرى النيل السفلي!',
      subtitle: 'نهاية مشوقة لليوم الثاني • هدير مياه الأزل تحت قدس الأقداس',
      dramaticNarrative: [
        'مع استقرار شعاع الشمس المركز على المذبح الملكي، دوت طرقعة حجرية هائلة اهتزت لها أعمدة الكرنك المهيبة!',
        'انزلقت بلاطة جرانيتية تزن أطنان عدة في أرضية قدس الأقداس، لتكشف عن فوهة بئر صخرية سحيقة يتدفق في أعماقها تيار ماء جارف يزأر بصوت دوامة عملاقة!',
        'انبعثت من الفوهة برودة رطبة رائحتها طمي النيل العتيق وأعشاب مجهولة، وبدأت المياه ترتفع بسرعة نحو درجات البهو!',
        'صرخت الدكتورة ليلى وهي تمسك بأجهزة الرصد الميدانية: "هذا هو السرداب المائي الغارق الذي ذكره ملوك الأسرة الثامنة عشرة! إنه متصل مباشرة بشلالات أسوان الأولى.. لا يمكن النزول وسط هذا الفيضان المفاجئ، فالتيار جارف وسيبتلع أي إنسان! علينا التراجع الآن والانتظار حتى الغد حين تهدأ الدوامة عند جزر أسوان بفضل خبرة الريس سلامة وبوصلته النجمية!"',
      ],
      cliffhangerQuestion: 'كيف يرتبط معبد الأقصر بقنوات مائية سرية تمتد مئات الكيلومترات جنوباً حتى صخور أسوان؟',
      tomorrowPreviewTitle: 'غداً في اليوم الثالث: ملحمة النيل العظيم وأسرار جزيرة الفنتين',
      tomorrowPreviewTeaser: 'ستبحر مع الريس سلامة على متن فلوكة نيلية وسط صخور الجرانيت الأسوانية لرصد نجوم كوكبة الجبار واستخراج تميمة الجعران الأزرق!',
      characterQuote: {
        speakerName: 'د. ليلى فؤاد',
        speakerTitle: 'رئيسة بعثة التنقيب بالكرنك',
        avatar: lailaAvatar,
        quoteText: 'احذر يا بني! النيل له غضب وحكمة.. لن نغامر بالعبور إلا غداً مع هدوء الجريان وضياء كوكب الشعرى في سماء الفنتين!',
      },
      audioMood: 'mystery',
    },
  },

  {
    dayNumber: 3,
    title: 'اليوم الثالث: ملحمة النيل العظيم وجعران اللازورد',
    subtitle: 'مهمة الملاحة الليلية في شلالات أسوان الأولى وحل لغز النجوم',
    era: 'العصر الفرعوني الوسيط والملاحة النيلية المقدسة',
    locationId: 'aswan',
    locationName: 'جزيرة الفنتين، أسوان',
    mentorName: 'الريس سلامة',
    mentorAvatar: salamaAvatar,
    associatedPuzzleId: 'aswan_stargazer',
    estimatedMinutes: 30,
    completionBadge: 'جعران الفنتين اللازوردي',
    culturalWisdom: 'من قاد فلوكته بنجوم سوبدت في مياه الشلال، هانت عليه أصعب مسالك الصحراء.',
    stages: [
      {
        id: 'day3_stage1',
        stageNumber: 1,
        title: 'المرحلة الأولى: فحص مقياس النيل وصخور الجرانيت الوردي',
        shortDesc: 'استكشاف الدرجات الحجرية لمقياس النيل وتدقيق نقوش منسوب الفيضان التاريخي',
        detailedInstruction: 'توجه إلى ضفاف جزيرة الفنتين، وافحص مقياس النيل الصخري وسجل قراءات تدفق مياه الشلال.',
        actionType: 'inspect',
        targetId: 'hotspot_nilometer',
        targetLocationId: 'aswan',
        locationName: 'مقياس نيل الفنتين',
        objectiveSummary: 'توثيق مقياس النيل وقراءة ارتفاع مياه الفيضان',
        historicalContext: 'كان مقياس النيل في الفنتين يحدد مصير ضرائب مصر وزراعتها بناءً على ارتفاع الفيضان المقدس.',
      },
      {
        id: 'day3_stage2',
        stageNumber: 2,
        title: 'المرحلة الثانية: محاورة الريس سلامة واختبار أسرار التيار',
        shortDesc: 'نقاش مع أقدم بحاري النوبة لمعرفة موضع الصندوق الغارق قرب الجنادل الصخرية',
        detailedInstruction: 'تحدث مع الريس سلامة على ظهر الفلوكة، وأجب بحكمة البحارة لتكسب توجيهه نحو الصخرة الغارقة.',
        actionType: 'dialogue',
        targetId: 'salama',
        targetLocationId: 'aswan',
        locationName: 'شراع الفلوكة بأسوان',
        objectiveSummary: 'كسب ثقة الريس سلامة ومعرفة موقع الصندوق الغارق',
        historicalContext: 'بحارة النوبة في أسوان هم حراس مجاري الشلالات الأولى ويمتلكون معرفة شفهية موروثة بالخرائط المائية.',
      },
      {
        id: 'day3_stage3',
        stageNumber: 3,
        title: 'المرحلة الثالثة: لغز الملاحة النجمية واستخراج الجعران',
        shortDesc: 'مطابقة نجوم الشعرى اليمانية وحزام الجبار لتحديد إحداثيات الكنز الغارق',
        detailedInstruction: 'استخدم بوصلة النجوم للتوفيق بين كوكبة أوزوريس ونجم إيزيس حتى يطفو الصندوق الحجري.',
        actionType: 'puzzle',
        targetId: 'aswan_stargazer',
        targetLocationId: 'aswan',
        locationName: 'مرصد جنادل أسوان',
        objectiveSummary: 'حل لغز النجوم واستخراج تميمة الجعران الأزرق اللازوردي',
        historicalContext: 'كان ظهور نجم الشعرى اليمانية (سوبدت) يؤذن برأس السنة المصرية وعيد وفاء النيل الخالد.',
      },
    ],
    cliffhanger: {
      dayNumber: 3,
      title: 'انفجار الوميض اللازوردي وعاصفة الصحراء الكبرى!',
      subtitle: 'نهاية مشوقة لليوم الثالث • رياح الخماسين الحمراء تحجب شمس الصعيد',
      dramaticNarrative: [
        'فور أن استقر حجر الجعران الأزرق في يدك، انطلق منه شعاع ضوء فسفوري نقي رسم في سماء الليل صورة ثلاثية الأبعاد لهضبة الجيزة ومخلبي أبو الهول!',
        'لكن فجأة، تحول نسيم النيل العليل إلى صفير حاد مرعب.. واصطبغت السماء البعيدة باللون النحاسي القاني!',
        'هبت عاصفة رملية حمراء غاشمة من صحراء الغرب (رياح الخماسين) اقتلعت سعف النخيل وأخفت القمر والنجوم تحت جدار هائل من الرمال والغبار!',
        'الريس سلامة جذب حبال الشراع بسرعة وصاح بك وهو يقود الفلوكة نحو خليج صخري محمي: "عاصفة الأرواح الصحراوية أغلقت الطرق البرية والجوية! لا يمكن لقطار أو سيارة أو حتى جمل السير الليلة باتجاه الجيزة.. لن تهدأ العاصفة إلا مع بزوغ فجر الغد الحقيقي! تماسك يا بني، ليلتنا هذه ستكون في حماية كهوف الجرانيت، وغداً سننطلق مع أول خيط ضوء نحو الأهرامات!"',
      ],
      cliffhangerQuestion: 'هل كانت تلك العاصفة صدفة طبيعية، أم هي لعنة حراس المقابر لحجب الطريق نحو سراديب الجيزة؟',
      tomorrowPreviewTitle: 'غداً في اليوم الرابع: حراس الأفق وكسر أختام هضبة الجيزة',
      tomorrowPreviewTeaser: 'ستصل إلى مخلبي أبو الهول وتواجه الشيخ منصور حارس السراديب لحل لغز بناء الأهرامات ومحاذاة كوكبة الجبار!',
      characterQuote: {
        speakerName: 'الريس سلامة',
        speakerTitle: 'كبير بحارة الفلوكة النوبية',
        avatar: salamaAvatar,
        quoteText: 'الصحراء إذا غضبت غطت عين الشمس.. الصبر يا صاحبي هو زاد المستكشف الحق، وغداً نفتح أبواب الجيزة مع صفاء الجو!',
      },
      audioMood: 'sandstorm',
    },
  },

  {
    dayNumber: 4,
    title: 'اليوم الرابع: حراس الأفق وكسر أختام هضبة الجيزة',
    subtitle: 'مهمة فحص لوحة الحلم واختبار الشيخ منصور لحل لغز هندسة الأهرام',
    era: 'الدولة القديمة - عصر بناة الأهرامات العظام (الأسرة الرابعة)',
    locationId: 'giza',
    locationName: 'أهرامات الجيزة، ممر أبو الهول',
    mentorName: 'الشيخ منصور',
    mentorAvatar: mansourAvatar,
    associatedPuzzleId: 'pyramid_builder',
    estimatedMinutes: 35,
    completionBadge: 'شاقول المهندس الملكي',
    culturalWisdom: 'من استقام قلبه كزوايا الهرم الأكبر، انفتحت له سراديب الخلود دون خوف.',
    stages: [
      {
        id: 'day4_stage1',
        stageNumber: 1,
        title: 'المرحلة الأولى: تفحص لوحة الحلم بين مخلبي أبو الهول',
        shortDesc: 'قراءة نقوش الملك تحتمس الرابع ودراسة كسوة الحجر الجيري الأبيض',
        detailedInstruction: 'توجه إلى محيط أبو الهول وتفحص لوحة الحلم الجرانيتية ووثق وعد الفرعون بحماية تمثال الأفق.',
        actionType: 'inspect',
        targetId: 'hotspot_sphinx_paws',
        targetLocationId: 'giza',
        locationName: 'لوحة الحلم بأبو الهول',
        objectiveSummary: 'قراءة نص لوحة الحلم واستخلاص كلمة السر الملكية',
        historicalContext: 'تحكي اللوحة قصة نوم الأمير تحتمس في ظل أبو الهول وحلمه الذي وعده فيه بالعرش إذا أزال الرمال.',
      },
      {
        id: 'day4_stage2',
        stageNumber: 2,
        title: 'المرحلة الثانية: اختبار الشجاعة مع الشيخ منصور',
        shortDesc: 'حوار مهيب مع حارس سراديب هضبة الأهرام لنيل الإذن بدخول الممر الصخري',
        detailedInstruction: 'حاور الشيخ منصور بصدق المستكشف الوطني، وأظهر له القطع الثلاث التي جمعتها من القاهرة والأقصر وأسوان.',
        actionType: 'dialogue',
        targetId: 'mansour',
        targetLocationId: 'giza',
        locationName: 'خيمة حراس الهضبة',
        objectiveSummary: 'إثبات الأهلية وكسب إذن حارس السراديب لفتح القفل الصخري',
        historicalContext: 'عائلات حراس الأهرامات تتوارث معرفة الممرات السرية ومخارج الآبار الجافة عبر مئات السنين.',
      },
      {
        id: 'day4_stage3',
        stageNumber: 3,
        title: 'المرحلة الثالثة: لغز بناء الأهرامات ومحاذاة كوكبة الجبار',
        shortDesc: 'ضبط زاوية انحدار 51.5 درجة وتوجيه قنوات التهوية الملكية نحو نجوم أوزوريس',
        detailedInstruction: 'حل لغز الهندسة الإنشائية للأهرام بتثبيت الإسفين الخشبي وضبط زاوية الجرانيت ومحاذاة النجوم.',
        actionType: 'puzzle',
        targetId: 'pyramid_builder',
        targetLocationId: 'giza',
        locationName: 'محراب هندسة الأهرامات',
        objectiveSummary: 'حل لغز كوكبة الجبار ونيل شاقول المهندس المعماري الملكي',
        historicalContext: 'تتوافق أهرامات الجيزة الثلاثة بدقة هندسية ومقاييس فلكية مع نجوم حزام الجبار في السماء.',
      },
    ],
    cliffhanger: {
      dayNumber: 4,
      title: 'انزياح صخرة مخلب أبو الهول وترانيم السرداب المجهول!',
      subtitle: 'نهاية مشوقة لليوم الرابع • كشف مدخل الغرفة السرية الكبرى',
      dramaticNarrative: [
        'مع اكتمال ضبط الزاوية ومحاذاة نجوم الجبار، ارتجت هضبة الجيزة كلها بوقع اهتزاز أرضي مهيب ومتحكم!',
        'انفلقت الصخرة الكبرى الواقعة بين مخلبي أبو الهول وانزاحت ببطء إلى الداخل، لتكشف عن درج حلزوني هائل منحوت في قلب الصخر الأسود ينحدر إلى أعماق سحيقة تحت الأرض!',
        'من بطن السرداب المظلم، انبعثت نسمة باردة شديدة النقاء تنبض برائحة البخور الملكي الصافي، وتصاعدت نغمات ترانيم كهنوتية مهيبة بلغة هيروغليفية عذبة ترن في أرجاء الصمت!',
        'الشيخ منصور خر على ركبتيه إجلالاً ثم نهض ووضع يده على كتفك بعزم قائلاً: "لقد فُتح الباب الذي ظل مغلقاً لآلاف السنين يا بني! لكن النبوءة القديمة صريحة وحاسمة: لا يجوز لأي بشري أن يعبر عتبة المذبح الذهبي ويفك الختم الأخير إلا مع أول خيط من شمس الغد الحقيقي.. ليلتنا هذه هي ليلة الاستعداد الروحي والبدني، وغداً سنشهد أعظم كشف أثري في تاريخ البشرية!"',
      ],
      cliffhangerQuestion: 'ما هي الأسرار التي تنتظر في حجرة تحوت الذهبية أسفل أعماق هضبة الأهرامات؟',
      tomorrowPreviewTitle: 'غداً في اليوم الخامس والأخير: قدس أقداس تحوت والتتويج التاريخي الأبدي',
      tomorrowPreviewTeaser: 'ستعبر السرداب وتلتقي بطيف حكيم تحوت لتضع البردية الكاملة على المذبح الذهبي وتنال وسام حامي أسرار مصر الأبدي!',
      characterQuote: {
        speakerName: 'الشيخ منصور',
        speakerTitle: 'حارس سراديب هضبة الجيزة',
        avatar: mansourAvatar,
        quoteText: 'مباركٌ عليك الوصول يا بطل مصر.. ارتح الليلة واجمع شتات قوتك، فغداً هو يوم الخلود ويوم تتويج المستكشف الأعظم!',
      },
      audioMood: 'ancient_curse',
    },
  },

  {
    dayNumber: 5,
    title: 'اليوم الخامس: قدس أقداس تحوت والتتويج الأبدي',
    subtitle: 'المهمة الختامية الكبرى: كسر أختام البوابة ولقاء حكيم المعرفة الخالد',
    era: 'عصر حكماء الكلمة المقدسة - فجر الحضارة المصرية الأزلية',
    locationId: 'secret_chamber',
    locationName: 'غرفة أسرار تحوت، سراديب الجيزة',
    mentorName: 'روح حكيم تحوت',
    mentorAvatar: thothAvatar,
    associatedPuzzleId: 'giza_seal',
    estimatedMinutes: 40,
    completionBadge: 'تاج الحكمة والمستكشف الأعظم',
    culturalWisdom: 'مصر لا تموت، وحكمتها سرمدية تنتقل من جيل إلى جيل في قلوب من يحفظون تراثها.',
    stages: [
      {
        id: 'day5_stage1',
        stageNumber: 1,
        title: 'المرحلة الأولى: كسر الأختام الأربعة في بوابة السرداب',
        shortDesc: 'وضع القطع الثلاث: خاتم الكاهن، صولجان الشمس، وتميمة الجعران في تجاويف الباب',
        detailedInstruction: 'تقدم نحو بوابة السرداب الذهبية، وضع الآثار التي جمعتها في الأيام الماضية في تجاويفها المخصصة.',
        actionType: 'puzzle',
        targetId: 'giza_seal',
        targetLocationId: 'secret_chamber',
        locationName: 'بوابة السرداب الملكي',
        objectiveSummary: 'كسر أختام البوابة الأربعة ودخول قدس الأقداس',
        historicalContext: 'كانت السراديب الملكية تُؤمن بنظام هيدروليكي رملي يمنع أي متسلل غير حامل للرموز الصحيحة.',
      },
      {
        id: 'day5_stage2',
        stageNumber: 2,
        title: 'المرحلة الثانية: محاورة طيف الحكيم تحوت',
        shortDesc: 'المثول أمام سيد الكلمات المقدسة وتلقي الوصية الختامية لحكماء مصر',
        detailedInstruction: 'تحدث مع طيف تحوت بحكمة وتواضع، وأعلن إتمامك لجمع البردية خدمةً للوطن والإنسانية.',
        actionType: 'dialogue',
        targetId: 'spirit_thoth',
        targetLocationId: 'secret_chamber',
        locationName: 'محراب المذبح الذهبي',
        objectiveSummary: 'نيل مباركة حكيم تحوت واكتمال مهارات التفاوض والحكمة',
        historicalContext: 'كان تحوت هو حامي الكتبة والعلماء ورمز العدل والقمر في الوجدان المصري القديم.',
      },
      {
        id: 'day5_stage3',
        stageNumber: 3,
        title: 'المرحلة الثالثة: وضع البردية الكاملة والتتويج التاريخي',
        shortDesc: 'تتويج الرحلة ووضع بردية أسرار المعرفة على المذبح الذهبي البازلتي',
        detailedInstruction: 'ضع أجزاء البردية المكتملة فوق المذبح المقدس لاستخراج شهادة المستكشف الأعظم وإعلان النصر التاريخي.',
        actionType: 'inspect',
        targetId: 'hotspot_golden_altar',
        targetLocationId: 'secret_chamber',
        locationName: 'المذبح الذهبي المقدس',
        objectiveSummary: 'إعلان اكتمال المغامرة الكبرى ونيل وسام حامي التراث',
        historicalContext: 'المذبح الذهبي كان يمثل نقطة الخلود التي تلتقي فيها معرفة البشر مع روح الحضارة الخالدة.',
      },
    ],
    cliffhanger: {
      dayNumber: 5,
      title: 'اكتمال نبوءة الأجداد وتتويج حامي مصر الأبدي!',
      subtitle: 'الخاتمة التاريخية الكبرى • أنوار الخلود تضيء أرض الكنانة',
      dramaticNarrative: [
        'مع وضع البردية المكتملة على سطح المذبح الذهبي، التحمت أجزاؤها بنور أبيض باهر أضاء سراديب الجيزة بنور يشبه ضوء الفجر الصافي!',
        'ظهرت خريطة مصر كاملة من الدلتا إلى النوبة متلألئة بنقاط مضيئة تدل على كل أثر ومعبد، وعلت أصوات تهليل حكماء مصر ومؤرخيها عبر آلاف السنين!',
        'طيف تحوت رفع صولجانه المقدس ولمس به جبينك، لتشعر بتدفق حكمة الأجداد في وجدانك، قائلاً: "لقد أعدت لأرض الكنانة روحها.. لست مستكشفاً عابراً، بل أنت حامي التاج وحارس الهوية المصرية الخالدة!"',
        'مباركٌ عليك إتمام مغامرة الأيام الخمسة الحقيقية بنجاح باهر ومجد لا ينطفئ أبداً!',
      ],
      cliffhangerQuestion: 'ستبقى حكاية هذه الرحلة وسام شرف يتوارثه الأبناء عن الآباء.. عاشت مصر مهداً للحضارة ومنارةً للزمان!',
      tomorrowPreviewTitle: 'تهانينا الحارة! أتممت المغامرة بنجاح ساحق',
      tomorrowPreviewTeaser: 'يمكنك مراجعة سجل إنجازاتك في المفكرة، أو الاستمتاع بالتجوال الحر في جميع معالم مصر الأثرية!',
      characterQuote: {
        speakerName: 'طيف حكيم تحوت',
        speakerTitle: 'سيد الحكمة والكلمات المقدسة',
        avatar: thothAvatar,
        quoteText: 'من أحب تراب مصر وصان آثارها، خُلد اسمه في كتاب الزمان كضوء الشمس الذي لا يغيب أبداً!',
      },
      audioMood: 'revelation',
    },
  },
];

const STORAGE_KEY = 'egypt_adventure_daily_progress_v2';

export function getTodayDateString(offsetDays: number = 0): string {
  const date = new Date();
  if (offsetDays !== 0) {
    date.setDate(date.getDate() + offsetDays);
  }
  return date.toISOString().split('T')[0];
}

export function createInitialDailyProgress(): DailyProgressState {
  const today = getTodayDateString();
  return {
    startDate: today,
    lastPlayedDate: today,
    simulatedDayOffset: 0,
    activeDay: 1,
    days: {
      1: {
        dayNumber: 1,
        status: 'in_progress',
        completedStages: [],
        cliffhangerSeen: false,
      },
      2: {
        dayNumber: 2,
        status: 'locked',
        completedStages: [],
        cliffhangerSeen: false,
      },
      3: {
        dayNumber: 3,
        status: 'locked',
        completedStages: [],
        cliffhangerSeen: false,
      },
      4: {
        dayNumber: 4,
        status: 'locked',
        completedStages: [],
        cliffhangerSeen: false,
      },
      5: {
        dayNumber: 5,
        status: 'locked',
        completedStages: [],
        cliffhangerSeen: false,
      },
    },
  };
}

export function loadDailyProgress(): DailyProgressState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as DailyProgressState;
      // Re-evaluate unlocking based on real calendar dates or offset
      return syncProgressWithCalendar(parsed);
    }
  } catch (err) {
    console.error('Error loading daily progress', err);
  }
  return createInitialDailyProgress();
}

export function saveDailyProgress(progress: DailyProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving daily progress', err);
  }
}

/**
 * Checks if real calendar days have advanced and unlocks subsequent days accordingly
 */
export function syncProgressWithCalendar(progress: DailyProgressState): DailyProgressState {
  const effectiveToday = getTodayDateString(progress.simulatedDayOffset);
  const updatedDays = { ...progress.days };

  // Loop through days 2 to 5
  for (let dayNum = 2; dayNum <= 5; dayNum++) {
    const prevDay = updatedDays[dayNum - 1];
    const currentDay = updatedDays[dayNum];

    if (prevDay && prevDay.status === 'completed' && currentDay.status === 'locked') {
      // Check if real calendar date has passed or simulation unlocked it
      // Day is unlocked if:
      // 1. completedDateString exists and today's effective date is strictly after completedDateString, OR
      // 2. 24 hours have elapsed since completion timestamp, OR
      // 3. simulated offset explicitly advanced
      const isCompletedPreviousDay = prevDay.completedDateString ? effectiveToday > prevDay.completedDateString : false;
      const hoursElapsed = prevDay.completedAtTimestamp ? (Date.now() - prevDay.completedAtTimestamp) / (1000 * 60 * 60) : 0;

      if (isCompletedPreviousDay || hoursElapsed >= 24 || progress.simulatedDayOffset >= dayNum - 1) {
        updatedDays[dayNum] = {
          ...currentDay,
          status: 'unlocked',
        };
      }
    }
  }

  // Find active day (the highest unlocked or in_progress day that is not fully finished, or the highest finished)
  let activeDay = 1;
  for (let d = 1; d <= 5; d++) {
    if (updatedDays[d].status === 'in_progress' || updatedDays[d].status === 'unlocked') {
      activeDay = d;
      break;
    }
    if (updatedDays[d].status === 'completed') {
      activeDay = d;
    }
  }

  return {
    ...progress,
    lastPlayedDate: effectiveToday,
    days: updatedDays,
    activeDay,
  };
}

/**
 * Returns seconds remaining until midnight of the next real day
 */
export function getSecondsUntilNextRealDay(): number {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

export function formatTimeRemaining(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hStr = hours < 10 ? `0${hours}` : `${hours}`;
  const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${hStr}:${mStr}:${sStr}`;
}
