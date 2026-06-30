'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  History, 
  Trash2, 
  Brain, 
  HelpCircle, 
  Eye, 
  EyeOff,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRightLeft
} from 'lucide-react';
import { supabase } from './lib/supabaseClient';

// Полный словарь из 100 эмоций с определениями и советами на трех языках
const emotionsData = [
  // --- ROW 9 (Energy = 10, Y = 9) ---
  {
    x: 0, y: 9,
    en: { name: 'Enraged', def: 'Intense, explosive anger combined with a high state of agitation.', advice: 'Step away immediately. Practice slow, deep belly breathing and delay any response.' },
    ru: { name: 'В ярости', def: 'Крайняя степень гнева, сопровождающаяся сильным эмоциональным возбуждением.', advice: 'Немедленно прекратите контакт. Сделайте глубокие вдохи животом и отложите реакцию.' },
    kk: { name: 'Қаһарлы', def: 'Қатты қозу мен жойқын ыза араласқан ашу-ызаның ең жоғарғы шегі.', advice: 'Дереу оқиға орнынан алыстаңыз. Ішпен терең тыныс алып, кез келген әрекетті шегере тұрыңыз.' }
  },
  {
    x: 1, y: 9,
    en: { name: 'Panicked', def: 'A sudden, overwhelming feeling of fear that prevents logical thinking.', advice: 'Ground yourself. Look around and name 5 things you can see, 4 you can touch, and 3 you can hear.' },
    ru: { name: 'В панике', def: 'Внезапный всепоглощающий страх, парализующий рациональное мышление.', advice: 'Заземлитесь. Найдите глазами 5 предметов, потрогайте 4 текстуры, прислушайтесь к 3 звукам.' },
    kk: { name: 'Дүрліккен', def: 'Рационалды ойлауды бұғаттайтын кенеттен пайда болған қорқыныш сезімі.', advice: 'Жерге тұрақтаңыз (заземление). Айналадан 5 затты көзбен көріп, 4 затты ұстап, 3 дыбысты естіңіз.' }
  },
  {
    x: 2, y: 9,
    en: { name: 'Stressed', def: 'Feeling overwhelmed by cognitive, emotional, or physical pressure.', advice: 'Prioritize. Break big challenges into tiny steps and say "no" to non-essential tasks.' },
    ru: { name: 'В стрессе', def: 'Состояние сильного давления со стороны умственных или эмоциональных нагрузок.', advice: 'Расставьте приоритеты. Разбейте задачи на микрошаги и откажитесь от второстепенных дел.' },
    kk: { name: 'Күйзелісте', def: 'Ойлау, эмоционалдық немесе физикалық қысымнан туындаған шамадан тыс жүктеме.', advice: 'Басымдықтарды белгілеңіз. Үлкен міндеттерді ұсақ қадамдарға бөліп, маңызды емес істерден бас тартыңыз.' }
  },
  {
    x: 3, y: 9,
    en: { name: 'Jittery', def: 'Nervous, jumpy energy, often physically felt as shakiness or restlessness.', advice: 'Release physical tension. Stretch, walk, or shake your hands to burn off the excess adrenaline.' },
    ru: { name: 'Нервозный', def: 'Хаотичное нервное возбуждение, физически ощущаемое как дрожь или суета.', advice: 'Сбросьте физическое напряжение. Сделайте разминку, пройдитесь пешком или потрясите кистями рук.' },
    kk: { name: 'Қобалжулы', def: 'Діріл немесе мазасыздық түрінде сезілетін ретсіз жүйке қозуы.', advice: 'Физикалық шиеленісті босатыңыз. Сәл созылып, жаяу жүріңіз немесе қолдарыңызды сілкіңіз.' }
  },
  {
    x: 4, y: 9,
    en: { name: 'Shocked', def: 'A sudden, sharp surprise or disbelief caused by unexpected developments.', advice: 'Allow yourself a moment to process the news without making immediate judgements or decisions.' },
    ru: { name: 'В шоке', def: 'Внезапное сильное потрясение от неожиданного события или известия.', advice: 'Дайте себе время просто осознать новость, не пытаясь сразу принимать решения или делать выводы.' },
    kk: { name: 'Шошынған', def: 'Күтпеген оқиғадан немесе хабардан туындаған кенеттен болған күшті таңданыс.', advice: 'Жаңалықты қорыту үшін өзіңізге уақыт беріңіз, бірден шешім қабылдауға тырыспаңыз.' }
  },
  {
    x: 5, y: 9,
    en: { name: 'Surprised', def: 'A brief cognitive response to an unexpected but neutral or positive event.', advice: 'Observe your curiosity. Ask yourself what this unexpected occurrence teaches you.' },
    ru: { name: 'Удивленный', def: 'Кратковременная реакция на внезапное, но нейтральное или приятное событие.', advice: 'Проявите любопытство. Спросите себя, чему эта неожиданность может вас научить.' },
    kk: { name: 'Таң қалған', def: 'Күтпеген, бірақ бейтарап немесе жағымды оқиғаға қысқа мерзімді реакция.', advice: 'Қызығушылық танытыңыз. Бұл тосын жағдайдың сізге не үйрететіныін сұраңыз.' }
  },
  {
    x: 6, y: 9,
    en: { name: 'Upbeat', def: 'A cheerful, positive mood with a clear sense of optimism.', advice: 'Share your positive outlook! Use this energy to kickstart a collaborative project.' },
    ru: { name: 'Бодрый', def: 'Жизнерадостный, позитивный настрой с ярко выраженным оптимизмом.', advice: 'Поделитесь своим настроем! Направьте этот заряд на запуск совместных дел или творчество.' },
    kk: { name: 'Көтеріңкі', def: 'Айқын оптимизммен ерекшеленетін көңілді, жағымды көңіл-күй.', advice: 'Жақсы көңіл-күйіңізбен бөлісіңіз! Бұл қуатты бірлескен істерді бастауға бағыттаңыз.' }
  },
  {
    x: 7, y: 9,
    en: { name: 'Festive', def: 'A highly joyful, celebratory state of mind connected to sharing happiness.', advice: 'Celebrate this moment with others. Express gratitude for the people around you.' },
    ru: { name: 'Праздничный', def: 'Радостное, торжественное состояние духа, желание делиться весельем.', advice: 'Разделите этот момент с близкими. Поблагодарите окружающих за теплоту общения.' },
    kk: { name: 'Мерекелік', def: 'Қуанышты бөлісуге бағытталған салтанатты, шаттыққа толы көңіл-күй.', advice: 'Бұл сәтті жақындарыңызбен бөлісіңіз. Айналаңыздағы адамдарға ризашылық білдіріңіз.' }
  },
  {
    x: 8, y: 9,
    en: { name: 'Exhilarated', def: 'A thrilling, intensely exciting and joyful state of high energy.', advice: 'Enjoy the high! Write down your thoughts to remember this peak state for future inspiration.' },
    ru: { name: 'Оживленный', def: 'Волнительное, невероятно захватывающее и радостное состояние высокой энергии.', advice: 'Наслаждайтесь моментом! Запишите свои мысли, чтобы сохранить это вдохновение на будущее.' },
    kk: { name: 'Жігерленген', def: 'Жоғары қуатпен сипатталатын толқынысты, ерекше қуанышты көңіл-күй.', advice: 'Осы сәттен ләззат алыңыз! Шабытты болашақта еске түсіру үшін ойларыңызды жазып қойыңыз.' }
  },
  {
    x: 9, y: 9,
    en: { name: 'Ecstatic', def: 'An overwhelming, rapturous state of supreme joy and happiness.', advice: 'Savor every second. Let this positive emotional reserve strengthen your inner resilience.' },
    ru: { name: 'В экстазе', def: 'Всепоглощающее, восторженное состояние наивысшего счастья и радости.', advice: 'Смакуйте каждую секунду. Пусть этот эмоциональный ресурс укрепит вашу стойкость.' },
    kk: { name: 'Мәз-мейрам', def: 'Шексіз шаттану мен зор бақыт сезімінің ең жоғарғы шегі.', advice: 'Әрбір секундты сезініңіз. Бұл қуат болашақта ішкі төзімділігіңізді арттыруға көмектессін.' }
  },

  // --- ROW 8 (Energy = 9, Y = 8) ---
  {
    x: 0, y: 8,
    en: { name: 'Livid', def: 'Tremendous anger, usually silent but extremely tense and boiling.', advice: 'Practice progressive muscle relaxation. Tense and release your muscles sequentially.' },
    ru: { name: 'Разгневанный', def: 'Огромный гнев, часто тихий, но невероятно напряженный и закипающий.', advice: 'Попробуйте прогрессивную мышечную релаксацию: поочередно напрягайте и расслабляйте мышцы.' },
    kk: { name: 'Ызалы', def: 'Сыртынан білінбесе де, іштей қайнап тұрған орасан зор ашу-ыза.', advice: 'Бұлшықетті біртіндеп босату жаттығуын жасаңыз: денені кезекпен тартып, босатыңыз.' }
  },
  {
    x: 1, y: 8,
    en: { name: 'Furious', def: 'Violent anger and active outrage expressed with intense passion.', advice: 'Channel this active energy safely. Do intense physical exercise or write a raw thoughts journal.' },
    ru: { name: 'Яростный', def: 'Бурный гнев и активное возмущение, выражаемые с огромной страстью.', advice: 'Направьте эту энергию в безопасное русло: сделайте приседания или запишите злость на бумаге.' },
    kk: { name: 'Ашулы', def: 'Қатты құштарлықпен және белсенді наразылықпен көрінетін ашу сезімі.', advice: 'Бұл қуатты қауіпсіз арнаға бағыттаңыз: жаттығу жасаңыз немесе ойларыңызды қағазға жазыңыз.' }
  },
  {
    x: 2, y: 8,
    en: { name: 'Frustrated', def: 'Annoyance or distress arising from blocked goals or unresolved obstacles.', advice: 'Identify the exact barrier. Shift focus from the problem to a tiny alternative action.' },
    ru: { name: 'Разочарованный', def: 'Раздражение или тревога из-за препятствий на пути к важной цели.', advice: 'Определите конкретный барьер. Переключите внимание с проблемы на поиск альтернативного пути.' },
    kk: { name: 'Торыққан', def: 'Мақсатқа жету жолындағы кедергілерден туындаған реніш немесе мазасыздық.', advice: 'Кедергіні нақты анықтаңыз. Назарды мәселеден оны шешудин баламалы жолына бұрыңыз.' }
  },
  {
    x: 3, y: 8,
    en: { name: 'Tense', def: 'Unable to relax; experiencing mental strain and physical tightness.', advice: 'Take a brief break. Stretch your neck and shoulders, and sigh loudly to release pressure.' },
    ru: { name: 'Напряженный', def: 'Неспособность расслабиться; ощущение ментального и мышечного зажима.', advice: 'Сделайте паузу. Развейте плечи, покрутите шеей, сделайте шумный выдох с облегчением.' },
    kk: { name: 'Ширыққан', def: 'Босаңсуға қабілетсіздік; психикалық және бұлшықет қысымыния сезілуі.', advice: 'Қысқа үзіліс жасаңыз. Иық пен мойынды созып, қысымды жеңілдету үшін терең дем шығарыңыз.' }
  },
  {
    x: 4, y: 8,
    en: { name: 'Stunned', def: 'Left temporarily speechless by unexpected or overwhelming information.', advice: 'Give yourself permission to pause. Do not feel pressured to respond instantly.' },
    ru: { name: 'Ошеломленный', def: 'Временная потеря дара речи от неожиданной или шокирующей информации.', advice: 'Разрешите себе паузу. Вы не обязаны реагировать мгновенно, соберитесь с мыслями.' },
    kk: { name: 'Аң-таң', def: 'Күтпеген немесе таңқаларлық ақпараттан уақытша сөйлей алмай қалу.', advice: 'Кідіріс жасауға рұқсат етіңіз. Бірден жауап беруге асықпай, ойыңызды жинақтаңыз.' }
  },
  {
    x: 5, y: 8,
    en: { name: 'Hyper', def: 'Excessively active, excitable, and full of highly unfocused energy.', advice: 'Channel this high energy into structured physical activity or high-tempo tasks.' },
    ru: { name: 'Гиперактивный', def: 'Чрезмерно возбужденный, активный, переполненный хаотичной энергией.', advice: 'Направьте эту энергию в структуру: сделайте уборку, займитесь спортом или динамичной работой.' },
    kk: { name: 'Асқын белсенді', def: 'Шамадан тыс қозған, белсенді, ретсіз қуатқа толы күй.', advice: 'Бұл қуатты жүйелі физикалық белсенділікке немесе қарқынды жұмысқа бағыттаңыз.' }
  },
  {
    x: 6, y: 8,
    en: { name: 'Cheerful', def: 'An active, bright disposition that lights up your daily interactions.', advice: 'Spread the joy! Greet colleagues warmly or send a kind message to a friend.' },
    ru: { name: 'Жизнерадостный', def: 'Активный, яркий настрой, который согревает общение и повседневные дела.', advice: 'Поделись радостью! Поприветствуйте коллег или отправьте доброе сообщение близкому.' },
    kk: { name: 'Шаттықты', def: 'Күнделікті қарым-қатынасты жақсартатын белсенді, жарқын көңіл-күй.', advice: 'Қуанышпен бөлісіңіз! Әріптестеріңізге жылы лебіз білдіріңіз немесе досыңызға хат жазыңыз.' }
  },
  {
    x: 7, y: 8,
    en: { name: 'Motivated', def: 'A strong inner drive to take action and accomplish set goals.', advice: 'Act now! Tackle your most important, challenging task while your drive is at its peak.' },
    ru: { name: 'Мотивированный', def: 'Сильное внутреннее желание действовать и достигать поставленных целей.', advice: 'Действуйте прямо сейчас! Возьмитесь за самую сложную задачу, пока запал на высоте.' },
    kk: { name: 'Ынталы', def: 'Іс-әрекет жасауға "және қойылған мақсаттарға жетуге деген күшті ішкі ұмтылыс.', advice: 'Дереу әрекет етіңіз! Ынтаңыз шыңында тұрғанда, ең қиын тапсырманы орындаңыз.' }
  },
  {
    x: 8, y: 8,
    en: { name: 'Inspired', def: 'Feeling deeply touched and creative, driven to express or produce something unique.', advice: 'Create! Write, paint, plan, or solve. Let the creative flow run wild without self-censorship.' },
    ru: { name: 'Вдохновленный', def: 'Глубокий творческий подъем, побуждающий создавать или менять мир вокруг.', advice: 'Творите! Записывайте идеи, рисуйте, планируйте. Отпустите контроль и доверьтесь потоку.' },
    kk: { name: 'Шабыттанған', def: 'Бірегей нәрсені жасауға немесе өзгертуге итермелейтін терең шығармашылық серпін.', advice: 'Жасампаздық танытыңыз! Идеяларды жазыңыз, сурет салыңыз. Шығармашылық еркіндікке жол беріңіз.' }
  },
  {
    x: 9, y: 8,
    en: { name: 'Elated', def: 'A feeling of intense pride and joy, often related to achieving a success.', advice: 'Celebrate your growth. Acknowledge the hard work that brought you to this point.' },
    ru: { name: 'Ликующий', def: 'Чувство огромной радости и гордости, обычно связанное с достижением успеха.', advice: 'Отпразднуйте победу. Осознайте и похвалите себя за усилия, приведшие к успеху.' },
    kk: { name: 'Мәз-мейрам', def: 'Әдетте табысқа жетумен байланысты зор қуаныш пен мақтаныш сезімі.', advice: 'Жеңісіңізді атап өтіңіз. Осы жетістікке жету үшін жұмсалған күш-жігеріңізді бағалаңыз.' }
  },

  // --- ROW 7 (Energy = 8, Y = 7) ---
  {
    x: 0, y: 7,
    en: { name: 'Fuming', def: 'Silent, intense anger that is steadily building under the surface.', advice: 'Write down everything bothering you on a piece of paper, then tear it up to release tension.' },
    ru: { name: 'Кипящий от злости', def: 'Тихий, но крайне интенсивный гнев, медленно закипающий под маской спокойствия.', advice: 'Вылейте злость на бумагу: запишите все претензии, а затем порвите лист, чтобы освободить эмоцию.' },
    kk: { name: 'Ызадан жарылуға шақ', def: 'Сыртынан байқалмайтын, бірақ іштей біртіндеп қайнап келе жатқан қатты ашу.', advice: 'Ашуыңызды қағазға жазып шығыңыз, содан кейін шиеленісті босату үшін қағазды жыртып тастаңыз.' }
  },
  {
    x: 1, y: 7,
    en: { name: 'Frightened', def: 'Feeling afraid, alarmed, or anxious due to an immediate perceived threat.', advice: 'Find a safe space. Take slow breaths and focus on physical sensations of safety.' },
    ru: { name: 'Испуганный', def: 'Чувство страха или тревоги перед лицом мгновенной угрозы.', advice: 'Найдите безопасное место. Сфокусируйтесь на дыхании и напомните себе, что вы сейчас в безопасности.' },
    kk: { name: 'Қорққан', def: 'Төніп тұрған қауіп-қатерден туындаған үрей немесе алаңдаушылық сезімі.', advice: 'Қауіпсіз жер табыңыз. Тыныс алуға назар аударып, қазіргі сәтте қауіпсіз екеніңізді есіңізге түсіріңіз.' }
  },
  {
    x: 2, y: 7,
    en: { name: 'Angry', def: 'A strong feeling of displeasure and hostility sparked by perceived wrongdoing.', advice: 'Acknowledge the feeling. State clearly to yourself why you are angry before taking action.' },
    ru: { name: 'Сердитый', def: 'Сильное чувство недовольства и враждебности, вызванное нарушением ваших границ.', advice: 'Примите это чувство. Четко проговорите про себя причину гнева, прежде чем что-то предпринимать.' },
    kk: { name: 'Ашуланған', def: 'Шекараларыңыздың бұзылуынан туындаған күшті наразылық пен өшпенділік сезімі.', advice: 'Осы сезімді қабылдаңыз. Әрекет етпес бұрын ашулануыңыздың себебін өзіңізге нақты айтыңыз.' }
  },
  {
    x: 3, y: 7,
    en: { name: 'Nervous', def: 'Feeling anxious, apprehensive, or uneasy about an upcoming uncertain event.', advice: 'Normalize. Remind yourself that nervousness means you care. Shift focus to preparation.' },
    ru: { name: 'Беспокойный', def: 'Чувство тревоги и волнения перед важным или неопределенным событием.', advice: 'Это нормально. Напомните себе, что волнение означает неравнодушие. Направьте энергию на подготовку.' },
    kk: { name: 'Мазасыз', def: 'Маңызды немесе белгісіз оқиға алдындағы алаңдаушылық пен қобалжу сезімі.', advice: 'Бұл қалыпты жағдай. Қобалжу бұл істің сіз үшін маңызды екенін білдіреді. Қуатты дайындыққа бағыттаңыз.' }
  },
  {
    x: 4, y: 7,
    en: { name: 'Restless', def: 'Inability to rest or stay still; driven by internal uneasy energy.', advice: 'Change your setting. Go outside for a quick walk or engage in some light stretching.' },
    ru: { name: 'Неугомонный', def: 'Неспособность усидеть на месте, вызванная внутренним зудом или тревогой.', advice: 'Смените обстановку. Выйдите на свежий воздух, совершите быструю прогулку или разомнитесь.' },
    kk: { name: 'Тынымсыз', def: 'Ішкі мазасыздықтан немесе мазасыз қуаттан туындаған бір орында отыра алмау күйі.', advice: 'Ортаны өзгертіңіз. Далаға шығып серуендеңіз немесе жеңіл жаттығулар жасаңыз.' }
  },
  {
    x: 5, y: 7,
    en: { name: 'Energized', def: 'Feeling highly active, alert, and capable of tackling physical or mental tasks.', advice: 'Use this momentum! Dive into an important task that requires sharp focus.' },
    ru: { name: 'Энергичный', def: 'Ощущение бодрости, силы и готовности решать любые умственные или физические задачи.', advice: 'Используйте импульс! Направьте этот заряд на важные дела, требующие полной отдачи.' },
    kk: { name: 'Қуатты', def: 'Кез келген ақыл-ой немесе физикалық тапсырмаларды орындауға деген дайындық пен сергектік.', advice: 'Осы қарқынды пайдаланыңыз! Толық зейінді қажет ететін маңызды іске кірісіңіз.' }
  },
  {
    x: 6, y: 7,
    en: { name: 'Lively', def: 'Full of life and positive spirit, outgoing and highly interactive.', advice: 'Engage with people. Your dynamic state is perfect for brainstorms or team activities.' },
    ru: { name: 'Оживленный', def: 'Полный жизни, позитива и общительности настрой, открытый миру.', advice: 'Общайтесь! Ваше состояние идеально подходит для брейнсторминга и командных встреч.' },
    kk: { name: 'Жанды', def: 'Өміршеңдік пен жағымды рухқа толы, ашық және белсенді қарым-қатынас күйі.', advice: 'Адамдармен араласыңыз. Бұл жағдай ми шабуылы немесе топтық жұмыстар үшін өте қолайлы.' }
  },
  {
    x: 7, y: 7,
    en: { name: 'Enthusiastic', def: 'An active, passionate excitement about a specific topic, idea, or activity.', advice: 'Share your passion. Talk about your ideas with others to build momentum and excitement.' },
    ru: { name: 'Полный энтузиазма', def: 'Активный, искренний интерес и радость по поводу конкретной идеи или дела.', advice: 'Заражайте идеями! Обсудите свой проект с коллегами, чтобы привлечь единомышленников.' },
    kk: { name: 'Ынта-жігерлі', def: 'Белгілі бір идеяға, тақырыпқа немесе іске деген белсенді, шынайы қызығушылық.', advice: 'Құштарлығыңызбен бөлісіңіз. Ортақ мақсатқа жету үшін идеяларыңызды басқалармен талқылаңыз.' }
  },
  {
    x: 8, y: 7,
    en: { name: 'Optimistic', def: 'A hopeful confidence about the future and positive outcomes of activities.', advice: 'Plan. This is the best state to map out realistic, positive steps for your long-term goals.' },
    ru: { name: 'Оптимистичный', def: 'Уверенность в будущем и ожидание наилучшего исхода событий.', advice: 'Планируйте. Сейчас лучшее время, чтобы наметить реалистичные шаги для долгосрочных целей.' },
    kk: { name: 'Оптимистік', def: 'Болашаққа деген сенімділік және оқиғалардың жақсы аяқталуын күту.', advice: 'Жоспарлаңыз. Бұл ұзақ мерзімді мақсаттарға жетудің шынайы қадамдарын жасауға ең жақсы сәт.' }
  },
  {
    x: 9, y: 7,
    en: { name: 'Excited', def: 'A highly joyful, eager anticipation of positive future events.', advice: 'Channel this excitement productively. Take action on tasks you have been putting off.' },
    ru: { name: 'Возбужденный', def: 'Очень радостное и нетерпеливое предвкушение чего-то хорошего.', advice: 'Направьте это предвкушение в работу. Сделайте то, что давно откладывали из-за отсутствия энергии.' },
    kk: { name: 'Елірген', def: 'Жақсы нәрсені өте қуанышты және асыға күту сезімі.', advice: 'Бұл толқынысты нәтижелі бағыттаңыз. Бұрын кейінге қалдырып жүрген істеріңізді қолға алыңыз.' }
  },

  // --- ROW 6 (Energy = 7, Y = 6) ---
  {
    x: 0, y: 6,
    en: { name: 'Anxious', def: 'A persistent feeling of worry, unease, or fear about an upcoming situation.', advice: 'Exhale fully. Focus on slowing down your breath and reminding yourself of the current safety.' },
    ru: { name: 'Тревожный', def: 'Стойкое чувство беспокойства и дискомфорта перед неопределенным будущим.', advice: 'Удлиняйте выдох. Сделайте вдох на 4 счета, а выдох на 8, чтобы успокоить нервную систему.' },
    kk: { name: 'Мазасыз', def: 'Белгісіз болашақтың алдындағы тұрақты уайым мен жайсыздық сезімі.', advice: 'Демді толық шығарыңыз. Жүйкені тыныштандыру үшін 4 секунд дем алып, 8 секунд дем шығарыңыз.' }
  },
  {
    x: 1, y: 6,
    en: { name: 'Apprehensive', def: 'Fearful or nervous anticipation that something bad is about to happen.', advice: 'Check the facts. Is there objective proof of danger, or is it an anxious prediction?' },
    ru: { name: 'Опасающийся', def: 'Боязливое предчувствие того, что вот-вот должно случиться что-то плохое.', advice: 'Проверьте факты. Есть ли объективные доказательства угрозы или это просто игры ума?' },
    kk: { name: 'Секемшіл', def: 'Жаман бір нәрсе болып қалады-ау деген қорқынышты сезім.', advice: 'Фактілерді тексеріңіз. Қауіптің объективті дәлелі бар ма, әлде бұл тек қиялдың нәтижесі ме?' }
  },
  {
    x: 2, y: 6,
    en: { name: 'Worried', def: 'Thinking repetitively about potential problems and negative outcomes.', advice: 'Schedule a "worry time" (e.g. 10 mins) to think through problems, then focus on your current task.' },
    ru: { name: 'Обеспокоенный', def: 'Повторяющиеся мысли о потенциальных проблемах и их негативных последствиях.', advice: 'Выделите 10 минут на контролируемое «время для беспокойства», а затем переключитесь на дела.' },
    kk: { name: 'Уайымдаған', def: 'Ықтимал проблемалар мен олардың жағымсыз салдары туралы қайталанатын ойлар.', advice: 'Уайымдау үшін арнайы 10 минут бөліңіз, содан кейін бірден ағымдағы тапсырмаға ауысыңыз.' }
  },
  {
    x: 3, y: 6,
    en: { name: 'Irritated', def: 'A state of mild anger or impatience sparked by minor annoyances.', advice: 'Identify the trigger. Take a 2-minute silent pause to prevent reacting impulsively.' },
    ru: { name: 'Раздраженный', def: 'Легкая степень гнева или нетерпения, вызванная мелкими помехами.', advice: 'Найдите триггер. Возьмите двухминутную паузу молчания, чтобы не среагировать импульсивно.' },
    kk: { name: 'Тітіркенген', def: 'Ұсақ-түйек кедергілерден туындаған жеңіл ашу немесе төзімсіздік күйі.', advice: 'Триггерді анықтаңыз. Импульсивті әрекет етпеу үшін екі минуттық үнсіз үзіліс жасаңыз.' }
  },
  {
    x: 4, y: 6,
    en: { name: 'Annoyed', def: 'Slightly angry and impatient with a person, object, or situation.', advice: 'Communicate boundaries. Express your needs calmly using neutral "I-statements" (e.g. "I need...").' },
    ru: { name: 'Досадующий', def: 'Небольшой гнев и нетерпение по отношению к человеку или ситуации.', advice: 'Обозначьте границы. Выразите свои чувства спокойно через «Я-сообщения» (например: «Мне нужно...»).' },
    kk: { name: 'Ренжіген', def: 'Адамға немесе жағдайға байланысты сәл ашулану және төзімсіздік сезімі.', advice: 'Шекараны белгілеңіз. Сұраныстарыңызды сабырмен жеткізіңіз (мысалы: «Маған қазір ... қажет»).' }
  },
  {
    x: 5, y: 6,
    en: { name: 'Pleased', def: 'Feeling happy, satisfied, and content with a situation or achievement.', advice: 'Acknowledge the moment. Smile, internalize the positive result, and enjoy the ease.' },
    ru: { name: 'Довольный', def: 'Чувство радости и удовлетворения от текущей ситуации или успеха.', advice: 'Зафиксируйте успех. Улыбнитесь, мысленно похвалите себя и насладитесь моментом.' },
    kk: { name: 'Риза', def: 'Ағымдағы жағдайға немесе жетістікке байланысты қуаныш пен қанағаттану сезімі.', advice: 'Осы сәтті қабылдаңыз. Күлімсіреп, оң нәтижені іштей сезініңіз  және жеңілдіктен ләззат алыңыз.' }
  },
  {
    x: 6, y: 6,
    en: { name: 'Happy', def: 'A fundamental feeling of delight, pleasantness, and general well-being.', advice: 'Savor the happiness. Share a positive word or simple gesture of kindness with someone.' },
    ru: { name: 'Счастливый', def: 'Базовое чувство радости, благополучия и внутренней гармонии.', advice: 'Наслаждайтесь этим состоянием. Поделитесь теплым словом или сделайте добрый жест близкому.' },
    kk: { name: 'Бақытты', def: 'Қуаныштың, бақыттың және ішкі үйлесімділіктің негеізгі сезімі.', advice: 'Бақытты сезініңіз. Кімде-кімге болса да жылы сөз айтыңыз немесе кішігірім жақсылық жасаңыз.' }
  },
  {
    x: 7, y: 6,
    en: { name: 'Focused', def: 'A state of clear, concentrated attention directed towards a single task.', advice: 'Minimize distractions. Maintain this state by locking out notifications and completing your task.' },
    ru: { name: 'Сосредоточенный', def: 'Состояние ясного, направленного внимания на одну конкретную задачу.', advice: 'Уберите отвлекающие факторы. Поддерживайте фокус, отключив уведомления до завершения дела.' },
    kk: { name: 'Шоғырланған', def: 'Назарды бір нақты тапсырмаға бағыттаудың айқын, жинақы күйі.', advice: 'Кедергілерді жойыңыз. Хабарландыруларды өшіріп, тапсырманы соңына дейін орындаңыз.' }
  },
  {
    x: 8, y: 6,
    en: { name: 'Proud', def: 'A feeling of deep satisfaction with your own or your loved ones\' achievements.', advice: 'Validate yourself. Use this pride as a foundation of self-worth for future challenges.' },
    ru: { name: 'Гордый', def: 'Чувство глубокого удовлетворения своими достижениями или успехами близких.', advice: 'Утвердитесь в своих силах. Используйте эту гордость как опору для будущих вызовов.' },
    kk: { name: 'Мақтанышты', def: 'Өз жетістіктеріңізге немесе жақындарыңыздың табысларына деген терең қанағаттану сезімі.', advice: 'Өзіңізді бағалаңыз. Бұл мақтанышты болашақ сынақтарда сенімділік тірегі ретінде пайдаланыңыз.' }
  },
  {
    x: 9, y: 6,
    en: { name: 'Thrilled', def: 'A high-energy wave of excitement, delight, and intense pleasure.', advice: 'Express your joy! Do a little happy dance, laugh, or celebrate the breakthrough.' },
    ru: { name: 'В восторге', def: 'Волна яркого возбуждения, радости и глубокого удовольствия.', advice: 'Выразите радость! Посмейтесь, отпразднуйте этот прорыв или поделитесь им.' },
    kk: { name: 'Елтіген', def: 'Жарқын толқыныс, қуаныш және терең рахаттану сезімі.', advice: 'Қуанышыңызды білдіріңіз! Күліңиз, осы жетістікті атап өтіңіз немесе бөлісіңіз.' }
  },

  // --- ROW 5 (Energy = 6, Y = 5) ---
  {
    x: 0, y: 5,
    en: { name: 'Repulsed', def: 'An intense dislike, rejection, or physical disgust towards something.', advice: 'Create physical or mental space. Walk away from the source of distaste and refresh yourself.' },
    ru: { name: 'Отвергающий', def: 'Сильное чувство отторжения, неприязни или физического отвращения.', advice: 'Создайте дистанцию. Отойдите от источника неприятия и переключите внимание.' },
    kk: { name: 'Жиіркенген', def: 'Бір нәрсеге деген қатты жақтырмаушылық, бас тарту немесе жиіркену сезімі.', advice: 'Қашықтықты сақтаңыз. Жиіркеніш тудырған нәрседен алыстап, назарыңызды басқаға аударыңыз.' }
  },
  {
    x: 1, y: 5,
    en: { name: 'Troubled', def: 'Experiencing mental distress, persistent problems, or inner conflicts.', advice: 'Talk it out. Share your concerns with a trusted friend or write them down to structure them.' },
    ru: { name: 'Беспокойный', def: 'Переживание ментального разлада, нерешенных проблем или внутреннего конфликта.', advice: 'Выговоритесь. Поделитесь переживаниями с другом или запишите их для структурирования.' },
    kk: { name: 'Мазаланған', def: 'Психикалық мазасыздық, шешілмеген мәселелер немесе ішкі қақтығыстарды бастан кешіру.', advice: 'Ішіңізді босатыңыз. Ойларыңызды сенімді досыңызбен бөлісіңіз немесе жүйелеу үшін қағазға жазыңыз.' }
  },
  {
    x: 2, y: 5,
    en: { name: 'Concerned', def: 'Feeling worried interest, responsibility, or anxiety about someone or something.', advice: 'Convert worry into action. Make a step-by-step plan to help or resolve the issue.' },
    ru: { name: 'Озабоченный', def: 'Тревожный interest, чувство ответственности или беспокойство за кого-то/что-то.', advice: 'Превратите заботу в план. Сделайте конкретный шаг, чтобы помочь или решить проблему.' },
    kk: { name: 'Алаңдаған', def: 'Кімге болса да немесе не нәрсеге болса да жауапкершілік сезімі немесе алаңдаушылық таныту.', advice: 'Алаңдаушылықты жоспарға айналдырыңыз. Көмектесу немесе мәселені шешу үшін нақты қадам жасаңыз.' }
  },
  {
    x: 3, y: 5,
    en: { name: 'Uneasy', def: 'An uncomfortable feeling of instability, lack of peace, or mild anxiety.', advice: 'Find the source. Ask: "What feels unstable right now?" Focus on what you can control.' },
    ru: { name: 'Неловкий', def: 'Дискомфортное ощущение нестабильности, отсутствие покоя или легкая тревога.', advice: 'Найдите корень проблемы. Спросите себя: «Что именно выбивает меня из колеи?» Контролируйте то, что можете.' },
    kk: { name: 'Ыңғайсызданған', def: 'Тұрақсыздықтың, тыныштықтың болмауының немесе жеңіл алаңдаушылықтың жайсыз сезімі.', advice: 'Мәселенің түпкі себебін табыңыз. Өзіңізден сұраңыз: «Маған нақты не маза бермей тұр?» Тек бақылай алатын нәрселерге назар аударыңыз.' }
  },
  {
    x: 4, y: 5,
    en: { name: 'Peeved', def: 'Annoyed or irritated by a minor, repetitive, or petty disturbance.', advice: 'Let it go. Remind yourself that this small annoyance is temporary and not worth your peace.' },
    ru: { name: 'Раздраженный', def: 'Досада, вызванная мелкой, повторяющейся или незначительной помехой.', advice: 'Отпустите это. Напомните себе, что эта мелочь временная и не стоит вашего душевного покоя.' },
    kk: { name: 'Ренжіген', def: 'Шағын, қайталанатын немесе маңызды емес кедергілерден туындаған өкпе сезімі.', advice: 'Оны жібере салыңыз. Бұл ұсақ-түйек уақытша екенін және жан тыныштығыңызға тұрмайтынын есіңізге түсіріңіз.' }
  },
  {
    x: 5, y: 5,
    en: { name: 'Pleasant', def: 'A mild, friendly state of comfortable satisfaction and social openness.', advice: 'Enjoy the balance. Be open to light conversations and gentle, uncomplicated activities.' },
    ru: { name: 'Приятный', def: 'Мягкое, дружелюбное состояние комфортного удовлетворения и открытости.', advice: 'Наслаждайтесь балансом. Будьте открыты к легким беседам и спокойным, простым делам.' },
    kk: { name: 'Жағымды', def: 'Жайлы қанағаттану мен ашықтықтың жұмсақ, достық күйі.', advice: 'Баланстан ләззат алыңыз. Жеңіл әңгімелер мен тыныш, қарапайым істерге ашық болыңыз.' }
  },
  {
    x: 6, y: 5,
    en: { name: 'Joyful', def: 'A bright, active feeling of gladness and high sensory pleasure.', advice: 'Engage fully. Share a warm conversation, do a hobby, or laugh freely with others.' },
    ru: { name: 'Радостный', def: 'Яркое, теплое чувство удовольствия, счастья и открытости миру.', advice: 'Вовлекитесь в жизнь! Займитесь любимым хобби, посмейтесь с друзьями или прогуляйтесь.' },
    kk: { name: 'Шаттанған', def: 'Қуаныштың, бақыттың және әлемге ашықтықтың жарқын, жылы сезімі.', advice: 'Өмірге белсене араласыңыз! Сүйікті хоббиіңізбен айналысыңыз немесе достарыңызбен бірге күліңіз.' }
  },
  {
    x: 7, y: 5,
    en: { name: 'Hopeful', def: 'A positive expectation and desire for a good outcome in the future.', advice: 'Nurture this hope. Write down what a successful outcome looks like and steps to get there.' },
    ru: { name: 'Надеющийся', def: 'Оптимистичные ожидания и искреннее желание хорошего исхода событий.', advice: 'Подпитайте надежду. Опишите мысленно или на бумаге наилучший сценарий развития событий.' },
    kk: { name: 'Үміттенген', def: 'Оқиғалардың жақсы аяқталуына деген оңтайлы күту және шынайы тілек.', advice: 'Үмітіңізді нығайтыңыз. Жақсы нәтиженің қандай болатынын және оған жететін қадамдарды жазып қойыңыз.' }
  },
  {
    x: 8, y: 5,
    en: { name: 'Playful', def: 'Lighthearted, full of fun, and desire to engage in recreational activities.', advice: 'Have fun! Play a game, joke with friends, or approach a standard task with creative humor.' },
    ru: { name: 'Игривый', def: 'Беззаботный настрой, желание шутить, играть и веселиться.', advice: 'Повеселитесь! Сыграйте в игру, пошутите с друзьями или подойдите к рутине творчески.' },
    kk: { name: 'Ойнақы', def: 'Уайымсыз көңіл-күй, әзілдесуге, ойнауға және көңіл көтеруге деген ұмтылыс.', advice: 'Көңіл көтеріңіз! Ойын ойнаңыз, достарыңызбен әзілдесіңіз немесе күнделікті іске шығармашылықпен қараңыз.' }
  },
  {
    x: 9, y: 5,
    en: { name: 'Blissful', def: 'A state of extreme, tranquil happiness and peaceful joy.', advice: 'Immerse in the present. Do not worry about past or future; just breathe and be.' },
    ru: { name: 'Блаженный', def: 'Состояние глубокого, безмятежного счастья и умиротворенной радости.', advice: 'Растворитесь в моменте. Отпустите мысли о прошлом или будущем, просто дышите и будьте.' },
    kk: { name: 'Рахаттанған', def: 'Терең, бейқұт бақыт пен тыныш қуаныштың ерекше күйі.', advice: 'Қазіргі сәтпен бірігіңіз. Өткен немесе болашақ туралы ойларды жіберіңіз, жай ғана тыныс алыңыз.' }
  },

  // --- ROW 4 (Energy = 5, Y = 4) ---
  {
    x: 0, y: 4,
    en: { name: 'Disgusted', def: 'A strong feeling of revulsion or disapproval towards an object, action, or idea.', advice: 'Acknowledge your boundaries. Identify what caused the disgust and focus on clearing your space.' },
    ru: { name: 'Испытывающий отвращение', def: 'Сильное чувство отторжения или неодобрения чего-либо.', advice: 'Осознайте свои границы. Поймите причину отвращения и сфокусируйтесь на очищении пространства.' },
    kk: { name: 'Жиіркенген', def: 'Бір нәрсеге, әрекетке немесе идеяға деген күшті бас тарту немесе жиіркеніш сезімі.', advice: 'Шекараларыңызды таныңыз. Жиіркеніш тудырған себепті анықтап, кеңістігіңізді тазартуға назар аударыңыз.' }
  },
  {
    x: 1, y: 4,
    en: { name: 'Glum', def: 'Dejected, silent, and gloomy; carrying a quiet heavy weight.', advice: 'Be gentle with yourself. You do not have to put on a happy face; allow yourself a quiet space.' },
    ru: { name: 'Угрюмый', def: 'Подавленный, молчаливый и мрачный; ощущение тихой тяжести внутри.', advice: 'Будьте бережны к себе. Вам не нужно притворяться веселым; позвольте себе побыть в тишине.' },
    kk: { name: 'Тұнжыр', def: 'Төмен, үнсіз және мұңды көңіл-күй; іштей ауырлық сезімін алып жүру.', advice: 'Өзіңізге ұқыпты болыңыз. Көңілді болып көрінуге тырыспаңыз; үнсіздікте болуға рұқсат етіңіз.' }
  },
  {
    x: 2, y: 4,
    en: { name: 'Disappointed', def: 'Sadness sparked by expectations not being met or outcomes failing.', advice: 'Reframe. Accept the gap between expectations and reality, and extract a valuable lesson.' },
    ru: { name: 'Разочарованный', def: 'Грусть, вызванная тем, что ожидания не совпали с реальностью.', advice: 'Пересмотрите взгляд. Примите разрыв между планом и реальностью, извлеките ценный опыт.' },
    kk: { name: 'Налыған', def: 'Күтулердің шындықпен сәйкес келмеуінен туындаған мұңлы сезім.', advice: 'Көзқарасыңызды өзгертіңіз. Жоспар мен шындық арасындағы алшақтықты қабылдап, құнды тәжірибе алыңыз.' }
  },
  {
    x: 3, y: 4,
    en: { name: 'Down', def: 'Feeling slightly sad, low-energy, and discouraged with daily routines.', advice: 'Do a small act of self-care. Drink warm tea, wrap yourself in a blanket, or call a loved one.' },
    ru: { name: 'Подавленный', def: 'Легкая грусть, низкий уровень энергии и нежелание заниматься рутиной.', advice: 'Позаботьтесь о себе. Выпейте теплого чаю, завернитесь в плед или позвоните близкому другу.' },
    kk: { name: 'Мұңайған', def: 'Жеңіл мұң, қуаттың төмендігі және күнделікті істермен айналысуға деген құлықсыздық.', advice: 'Өзіңізге қамқорлық жасаңыз. Жылы шай ішіңіз, пледке ораныңыз немесе жақын досыңызға хабарласыңыз.' }
  },
  {
    x: 4, y: 4,
    en: { name: 'Apathetic', def: 'A lack of enthusiasm, concern, energy, or emotional reaction.', advice: 'Do not force high activity. Rest and start with small, non-demanding physical tasks.' },
    ru: { name: 'Апатичный', def: 'Отсутствие энтузиазма, интереса, энергии или эмоциональных реакций.', advice: 'Не заставляйте себя активничать. Отдохните и начните с простых механических действий.' },
    kk: { name: 'Апатиялық', def: 'Ынтаның, қызығушылықтың, қуаттың немесе эмоционалды реакциялардың болмауы.', advice: 'Өзіңізді белсенді болуға мәжбүрлемеңіз. Тынығыңыз және қарапайым механикалық әрекеттерден бастаңыз.' }
  },
  {
    x: 5, y: 4,
    en: { name: 'At Ease', def: 'Free from worry, awkwardness, or anxiety; fully relaxed and stable.', advice: 'Savor this comfort. It is an excellent state for calm reading, reflection, or gentle hobbies.' },
    ru: { name: 'Непринужденный', def: 'Свободный от беспокойства, зажимов или тревог; полностью расслабленный.', advice: 'Насладитесь комфортом. Отличное состояние для спокойного чтения, размышлений или хобби.' },
    kk: { name: 'Еркін', def: 'Уайымнан, қысымнан немесе алаңдаушылықтан ада; толық босаңсыған күй.', advice: 'Жайлылықтан ләззат алыңыз. Тыныш кітап оқу, ойлану немесе хоббимен айналысу үшін тамаша сәт.' }
  },
  {
    x: 6, y: 4,
    en: { name: 'Easygoing', def: 'Relaxed and casual, tolerant, and not easily upset by small events.', advice: 'Go with the flow. Your open and relaxed state makes you highly pleasant to collaborate with.' },
    ru: { name: 'Добродушный', def: 'Расслабленный, терпимый настрой, не поддающийся мелким невзгодам.', advice: 'Плывите по течению. Ваше открытое и спокойное состояние делает вас отличным партнером в общении.' },
    kk: { name: 'Жайдарлы', def: 'Ұсақ-түйек қиындықтарға бой алдырмайтын босаңсыған, төзімді көңіл-күй.', advice: 'Ағыспен жүріңіз. Сіздің ашық және тыныш күйіңіз қарым-қатынаста керемет серіктес етеді.' }
  },
  {
    x: 7, y: 4,
    en: { name: 'Content', def: 'A state of peaceful happiness and comfortable satisfaction with what is.', advice: 'Express gratitude. Acknowledge the positive elements in your life right now.' },
    ru: { name: 'Удовлетворенный', def: 'Состояние мирного счастья и комфортного принятия текущего момента.', advice: 'Выразите благодарность. Осознайте и цените то хорошее, что уже есть в вашей жизни.' },
    kk: { name: 'Қанағаттанған', def: 'Тыныш бақыт және қазіргі сәтті жайлы қабылдау күйі.', advice: 'Ризашылық білдіріңіз. Қазіргі өмыріңізде бар жақсы нәрселерді сезініңіз және бағалаңыз.' }
  },
  {
    x: 8, y: 4,
    en: { name: 'Loving', def: 'Feeling deep affection, warmth, and care for others or yourself.', advice: 'Express your warmth. Give a hug, pay a sincere compliment, or write a loving note.' },
    ru: { name: 'Любящий', def: 'Чувство глубокой привязанности, тепла и искренней заботы о близких или себе.', advice: 'Проявите теплоту. Обнимите близкого, сделайте искренний комплимент или поддержите себя.' },
    kk: { name: 'Сүйіспеншіл', def: 'Жақындарға немесе өзіне деген терең бауыр басу, жылылық пен шынайы қамқорлық сезімі.', advice: 'Жылылық танытыңыз. Жақыныңызды құшақтаңыз, шынайы комплимент айтыңыз немесе өзіңізді қолдаңыз.' }
  },
  {
    x: 9, y: 4,
    en: { name: 'Fulfilled', def: 'Deep satisfaction arising from achieving your potential or living values.', advice: 'Reflect on your journey. Think about the values that guide you and reinforce them.' },
    ru: { name: 'Реализованный', def: 'Глубокое удовлетворение от раскрытия потенциала или жизни по ценностям.', advice: 'Оглянитесь на свой путь. Подумайте о ценностях, которые ведут вас, и закрепите их.' },
    kk: { name: 'Баянды', def: 'Әлеуетті ашудан немесе құндылықтарға сай өмір сүруден туындайтын терең қанағаттану.', advice: 'Өткен жолыңызға көз салыңыз. Сізді бағыттайтын құндылықтар туралы ойланып, оларды бекіте түсіңіз.' }
  },

  // --- ROW 3 (Energy = 4, Y = 3) ---
  {
    x: 0, y: 3,
    en: { name: 'Pessimistic', def: 'Tending to see the worst aspect of things or believe the worst will happen.', advice: 'Gently challenge your thoughts. Write down one alternative positive or neutral scenario.' },
    ru: { name: 'Пессимистичный', def: 'Склонность видеть худшие стороны событий или ожидать негативного исхода.', advice: 'Поставьте мысли под сомнение. Запишите один альтернативный позитивный сценарий.' },
    kk: { name: 'Пессимистік', def: 'Оқиғалардың жаман жақтарын көруге немесе жағымсыз нәтиже күтуге бейімділік.', advice: 'Ойларыңызға күмәнмен қараңыз. Бір баламалы оң сценарийді жазып қойыңыз.' }
  },
  {
    x: 1, y: 3,
    en: { name: 'Morose', def: 'Sullen, gloomy, ill-tempered, and highly uncommunicative.', advice: 'Give yourself quiet space, but do not isolate completely. A brief walk alone can help.' },
    ru: { name: 'Мрачный', def: 'Угрюмый, хмурый и замкнутый настрой, нежелание идти на контакт.', advice: 'Дайте себе уединение, но не изолируйтесь совсем. Простая прогулка в одиночестве поможет.' },
    kk: { name: 'Тұнжыраған', def: 'Тұнжыраған, қабағы ашылмайтын және тұйық көңіл-күй, қарым-қатынастан қашу.', advice: 'Өзіңізге ұқыпты болыңыз. Көңілді болып көрінуге тырыспаңыз; үнсіздікте болуға рұқсат етіңіз.' }
  },
  {
    x: 2, y: 3,
    en: { name: 'Discouraged', def: 'Having lost confidence, enthusiasm, or hope in an outcome.', advice: 'Reset. Focus on a microscopic, extremely easy task to rebuild your sense of competence.' },
    ru: { name: 'Обескураженный', def: 'Потеря уверенности, энтузиазма или надежды на успешный исход.', advice: 'Начните сначала. Выполните микроскопическую, очень простую задачу, чтобы вернуть уверенность.' },
    kk: { name: 'Жігері құм болған', def: 'Сәтті нәтижеге деген сенімділікте, ынтаны немесе үмітті жоғалту.', advice: 'Қайта бастаңыз. Сенімділікті қайтару үшін кішкентай, өте қарапайым тапсырманы орындаңыз.' }
  },
  {
    x: 3, y: 3,
    en: { name: 'Sad', def: 'An essential emotional state of sorrow, grief, or unhappiness.', advice: 'Acknowledge your sadness. Crying is a natural physical release; do not judge your tears.' },
    ru: { name: 'Грустный', def: 'Базовое эмоциональное состояние печали, тоски или неудовлетворенности.', advice: 'Примите свою грусть. Слезы — это естественный способ сбросить напряжение, не корите себя.' },
    kk: { name: 'Мұңды', def: 'Мұң, қайғы немесе қанағаттанбаушылықтың негізгі эмоционалды күйі.', advice: 'Мұңыңызды қабылдаңыз. Жылау — шиеленісті түсірудің табиғи жолы, өзіңізді кінәламаңыз.' }
  },
  {
    x: 4, y: 3,
    en: { name: 'Bored', def: 'Feeling weary and restless due to lack of interest in current surroundings.', advice: 'Spark curiosity. Learn a new small fact, play a puzzle, or change your physical activity.' },
    ru: { name: 'Скучающий', def: 'Чувство утомления и пустоты из-за отсутствия интереса к происходящему.', advice: 'Разбудите интерес. Узнайте один новый факт, решите головоломку или смените занятие.' },
    kk: { name: 'Зеріккен', def: 'Болып жатқан жағдайға қызығушылықтың болмауынан туындаған шаршау мен бостық сезімі.', advice: 'Қызығушылықты оятыңыз. Бір жаңа факт біліңіз, жұмбақ шешіңіз немесе айналысатын ісіңізді өзгертіңіз.' }
  },
  {
    x: 5, y: 3,
    en: { name: 'Calm', def: 'A peaceful, serene state of mind free from agitation or strong emotions.', advice: 'Maintain this rhythm. It is a perfect state for mindful contemplation or focused tasks.' },
    ru: { name: 'Спокойный', def: 'Мирное, безмятежное состояние ума, свободное от тревог и бурных эмоций.', advice: 'Удерживайте этот ритм. Отличное время для вдумчивой работы или глубоких разговоров.' },
    kk: { name: 'Сабырлы', def: 'Мазасыздық пен қатты эмоциялардан ада, ақыл-ойдың тыныш, бейқұт күйі.', advice: 'Осы ырғақты сақтаңыз. Терең жұмыс жасау немесе маңызды әңгімелесу үшін тамаша уақыт.' }
  },
  {
    x: 6, y: 3,
    en: { name: 'Secure', def: 'Feeling safe, free from danger, fear, or self-doubt; stable.', advice: 'Celebrate your safety. Take a risk on expressing a creative thought or reaching out to someone.' },
    ru: { name: 'Безопасный', def: 'Ощущение защищенности, отсутствия угроз и уверенности в своих силах.', advice: 'Оцените свою защищенность. Попробуйте поделиться смелой идеей или сделать шаг вперед.' },
    kk: { name: 'Сенімді', def: 'Қауіпсіздік, қауіп-қатердің болмауы және өз күшіне деген сенімділік сезімі.', advice: 'Қауіпсіздігіңізді бағалаңыз. Батыл идеямен бөлісіп көріңіз немесе алға қарай қадам жасаңыз.' }
  },
  {
    x: 7, y: 3,
    en: { name: 'Satisfied', def: 'A pleasant feeling of fulfillment arising from desires being met.', advice: 'Acknowledge the success of your efforts. Take a moment to enjoy the finished result.' },
    ru: { name: 'Удовлетворенный', def: 'Приятное чувство завершенности и исполнения ваших желаний.', advice: 'Признайте успех своих усилий. Сделайте паузу, чтобы насладиться готовым результатом.' },
    kk: { name: 'Қанағаттанған', def: 'Тілектеріңіздің орындалуынан туындаған жағымды қанағаттану сезімі.', advice: 'Еңбегіңіздің нәтижесін бағалаңыз. Дайын нәтижеден ләззат алу үшін сәл кідіріңіз.' }
  },
  {
    x: 8, y: 3,
    en: { name: 'Grateful', def: 'Feeling or showing deep appreciation for benefits or kindness received.', advice: 'Express it! Send a simple thank-you note to someone who made a positive impact on you.' },
    ru: { name: 'Благодарный', def: 'Чувство признательности за полученное добро, тепло или поддержку.', advice: 'Выразите это! Напишите короткое «спасибо» человеку, который вам помог или поддержал.' },
    kk: { name: 'Ризашылықты', def: 'Көрсетілген жақсылыққа, жылылыққа немесе қолдауға деген алғыс сезімі.', advice: 'Мұны білдіріңіз! Сізге көмектескен немесе қолдау көрсеткен адамға қысқаша «рахмет» деп жазыңыз.' }
  },
  {
    x: 9, y: 3,
    en: { name: 'Touched', def: 'Feeling deeply moved by an act of kindness, empathy, or connection.', advice: 'Savor the warmth. Allow this soft, connected feeling to open your heart to empathy for others.' },
    ru: { name: 'Растроганный', def: 'Глубокое эмоциональное тепло от проявленной к вам доброты или близости.', advice: 'Сохраните это тепло. Пусть это мягкое чувство укрепит вашу веру в людей и доброту.' },
    kk: { name: 'Тебіренген', def: 'Көрсетілген мейірімділіктен немесе жақындықтан туындаған терең эмоционалды жылылық.', advice: 'Осы жылылықты сақтаңыз. Бұл сезім адамдарға және мейірімділікке деген сеніміңізді нығайтсын.' }
  },

  // --- ROW 2 (Energy = 3, Y = 2) ---
  {
    x: 0, y: 2,
    en: { name: 'Alienated', def: 'Feeling isolated, excluded, or foreign to your community or group.', advice: 'Connect gently. Reach out to one trusted person, or engage in a shared hobby online.' },
    ru: { name: 'Отчужденный', def: 'Чувство изолированности, одиночества и оторванности от общества или группы.', advice: 'Сделайте мягкий шаг к контакту. Напишите одному близкому человеку или найдите группу по интересам.' },
    kk: { name: 'Оқшауланған', def: 'Қоғамнан немесе топтан оқшаулану, жалғыздық және алшақтық сезімі.', advice: 'Қарым-қатынасқа жұмсақ қадам жасаңыз. Бір жақын адамыңызға жазыңыз немесе қызығушылықтар тобын табыңыз.' }
  },
  {
    x: 1, y: 2,
    en: { name: 'Miserable', def: 'Wretchedly unhappy, uncomfortable, and physically/emotionally drained.', advice: 'Focus on basic physical needs first. Drink water, eat hot food, and sleep.' },
    ru: { name: 'Несчастный', def: 'Крайне несчастливое, подавленное состояние, упадок сил и душевный дискомфорт.', advice: 'Сначала закройте базовые нужды. Выпейте теплой воды, съешьте что-то вкусное, отдохните.' },
    kk: { name: 'Бейшара', def: 'Өте бақытсыз, төмен күй, күштің сарқылуы және жан дүниесінің жайсыздығы.', advice: 'Алдымен негізгі қажеттіліктерді өтеңіз. Жылы су ішіңіз, дәмді тамақ ішіңіз, демалыңыз.' }
  },
  {
    x: 2, y: 2,
    en: { name: 'Lonely', def: 'Sadness sparked by feeling isolated or lacking meaningful connections.', advice: 'Engage in a passive shared activity. Go to a public library, cafe, or park to be around people.' },
    ru: { name: 'Одинокий', def: 'Грусть из-за отсутствия душевного контакта или изоляции от людей.', advice: 'Побудьте среди людей пассивно. Сходите в библиотеку, кофейню или парк, чтобы почувствовать общность.' },
    kk: { name: 'Жалғызсыраған', def: 'Адамдармен рухани байланыстың болмауынан немесе оқшауланудан туындаған мұң.', advice: 'Адамдар арасында болыңыз. Ортақтықты сезіну үшін кітапханаға, кофеханаға немесе саябаққа барыңыз.' }
  },
  {
    x: 3, y: 2,
    en: { name: 'Disheartened', def: 'Having lost determination, spirit, or hope after a setback.', advice: 'Acknowledge the blow. Give yourself a day to recover without judging your performance.' },
    ru: { name: 'Павший духом', def: 'Утеря решимости и боевого настроя после неудачи или препятствия.', advice: 'Примите этот удар. Дайте себе время на восстановление сил, не требуя от себя подвигов.' },
    kk: { name: 'Жігерсізденген', def: 'Сәтсіздіктен немесе кедергіден кейін шешімділік пен рухты жоғалту.', advice: 'Бұл соққыны қабылдаңыз. Өзіңізден ерлік талап етпей, күш жинау үшін өзіңізге уақыт беріңіз.' }
  },
  {
    x: 4, y: 2,
    en: { name: 'Tired', def: 'Drained of physical strength or energy; needing rest or sleep.', advice: 'Rest actively or passively. Put down your phone, close your eyes, and allow a 15-minute nap.' },
    ru: { name: 'Уставший', def: 'Недостаток физических сил или умственной энергии; потребность в отдыхе.', advice: 'Отдохните. Отложите телефон, закройте глаза и позвольте себе 15-минутный восстановительный сон.' },
    kk: { name: 'Шаршаған', def: 'Физикалық күштің немесе ақыл-ой қуатының жетіспеушілігі; демалыс қажеттілігі.', advice: 'Демалыңыз. Телефонды қойып, көзіңізді жұмыңыз және 15 минуттық қалпына келтіру ұйқысына уақыт бөліңіз.' }
  },
  {
    x: 5, y: 2,
    en: { name: 'Relaxed', def: 'Free from tension, tightness, and anxiety; enjoying peace.', advice: 'Maintain the peaceful flow. It is a wonderful time to stretch, take a slow bath, or walk.' },
    ru: { name: 'Расслабленный', def: 'Свободный от напряжения, зажимов и беспокойства; наслаждение покоем.', advice: 'Сохраняйте этот темп. Отличное время для легкой растяжки, теплой ванны или неспешной прогулки.' },
    kk: { name: 'Босаңсыған', def: 'Қысымнан, шиеленістен және уайымнан ада; тыныштықтан ләззат алу.', advice: 'Осы қарқынды сақтаңыз. Жеңіл созылу, жылы ванна қабылдау немесе асықпай серуендеу үшін қолайлы уақыт.' }
  },
  {
    x: 6, y: 2,
    en: { name: 'Chill', def: 'An easygoing, laidback state of stable, pleasant relaxation.', advice: 'Savor the simplicity. Connect with friends without any set plans; just enjoy their company.' },
    ru: { name: 'Расслабленный', def: 'Спокойное, легкое состояние стабильного и приятного отдыха.', advice: 'Насладитесь простотой момента. Пообщайтесь с друзьями без четких планов, просто ради процесса.' },
    kk: { name: 'Жайбарақат', def: 'Тұрақты және жағымды демалыстың тыныш, жеңіл күйі.', advice: 'Осы сәттің қарапайымдылығынан ләззат алыңыз. Достарыңызбен нақты жоспарсыз, жай ғана араласыңыз.' }
  },
  {
    x: 7, y: 2,
    en: { name: 'Restful', def: 'Quiet and soothing; helpful for recovering lost strength.', advice: 'Maximize recovery. Dim the lights, turn off notifications, and allow your brain to sit in silence.' },
    ru: { name: 'Покойный', def: 'Тихое, умиротворенное состояние, помогающее восполнить силы.', advice: 'Усильте восстановление. Приглушите свет, отключите гаджеты и побудьте в полной тишине.' },
    kk: { name: 'Тыныш', def: 'Күшті қалпына келтіруге көмектесетін тыныш, байсалды күй.', advice: 'Қалпына келуді күшейтіңіз. Жарықты бәсеңдетіп, гаджеттерді өшіріңіз және толық тыныштықта болыңыз.' }
  },
  {
    x: 8, y: 2,
    en: { name: 'Blessed', def: 'Feeling highly favored, safe, and deeply fortunate for life circumstances.', advice: 'Write down three specific blessings or positive things currently in your life.' },
    ru: { name: 'Благословенный', def: 'Глубокое чувство благодарности судьбе за безопасность и благополучие.', advice: 'Запишите три вещи, за которые вы чувствуете себя счастливым прямо сейчас.' },
    kk: { name: 'Бақытты (Жарылқанған)', def: 'Қауіпсіздік пен жақсылық үшін тағдырға деген терең ризашылық сезімі.', advice: 'Қазіргі өмірді өзгертетін үш нәрсені жазып қойыңыз.' }
  },
  {
    x: 9, y: 2,
    en: { name: 'Balanced', def: 'Feeling emotionally centered, stable, and keeping life in perfect perspective.', advice: 'Anchor this. Notice how you achieved this balance so you can replicate it in tougher times.' },
    ru: { name: 'Сбалансированный', def: 'Ощущение душевного равновесия, стабильности и правильного фокуса внимания.', advice: 'Запомните это состояние. Проанализируйте, как вы его достигли, чтобы вернуть его при стрессе.' },
    kk: { name: 'Балансталған', def: 'Жан дүниесінің тепе-теңдігі, тұрақтылық және дұрыс зейін сезімі.', advice: 'Осы күйді есте сақтаңыз. Күйзеліс кезінде оны қайтару үшін оған как қол жеткізгеніңізді талдаңыз.' }
  },

  // --- ROW 1 (Energy = 2, Y = 1) ---
  {
    x: 0, y: 1,
    en: { name: 'Despondent', def: 'In low spirits and lacking confidence; experiencing loss of hope.', advice: 'Be kind to your mind. Do not pressure yourself to succeed today; prioritize basic survival.' },
    ru: { name: 'Унывающий', def: 'Подавленное состояние духа, потеря веры в свои силы и надежды на лучшее.', advice: 'Будьте добры к себе. Не требуйте от себя успехов сегодня; сфокусируйтесь на базовом комфорте.' },
    kk: { name: 'Торыққан', def: 'Рухтың түсуі, өз күшіне деген сенімділік пен жақсылықтан үміт үзу.', advice: 'Өзіңізге мейірімді болыңыз. Бүгін өзіңізден үлкен табыстарды талап етпеңіз; негізгі жайлылыққа назар аударыңыз.' }
  },
  {
    x: 1, y: 1,
    en: { name: 'Depressed', def: 'Experiencing severe, persistent feelings of sadness and lack of initiative.', advice: 'Take tiny, non-demanding steps. Open the window, sit up, and talk to a professional if it persists.' },
    ru: { name: 'Депрессивный', def: 'Глубокое, стойкое чувство тоски, апатии и нежелания проявлять инициативу.', advice: 'Делайте крошечные шаги. Откройте окно, сядьте поудобнее, при затяжном состоянии обратитесь к специалисту.' },
    kk: { name: 'Күйзелістегі', def: 'Терең, тұрақты мұң, апатия және белсенділік танытқысы келмеу сезімі.', advice: 'Кішкентай қадамдар жасаңыз. Терезені ашыңыз, ыңғайлы отырыңыз, ұзаққа созылса маманға хабарласыңыз.' }
  },
  {
    x: 2, y: 1,
    en: { name: 'Sullen', def: 'Bad-tempered, gloomy, and resentful; refusing to participate.', advice: 'Acknowledge the resentment. Give yourself a boundary to process the silent anger without guilt.' },
    ru: { name: 'Угрюмый', def: 'Раздражительно-мрачный настрой, обида и нежелание участвовать в делах.', advice: 'Примите свою обиду. Дайте себе время пережить этот молчаливый гнев без чувства вины.' },
    kk: { name: 'Тұнжыраған', def: 'Ашулы-мұңды көңіл-күй, реніш және істерге араласқысы келмеу.', advice: 'Ренішіңізді қабылдаңыз. Өзіңізді кінәламай, осы үнсіз ашуды бастан өткеруге уақыт беріңіз.' }
  },
  {
    x: 3, y: 1,
    en: { name: 'Exhausted', def: 'Completely drained of all physical, mental, and emotional energy.', advice: 'Stop doing tasks. Your body demands rest; sleep, lay down, and unplug completely.' },
    ru: { name: 'Истощенный', def: 'Полное, абсолютное отсутствие физических, умственных и душевных сил.', advice: 'Остановите все дела. Ваше тело требует отдыха: поспите, полежите и полностью отключите гаджеты.' },
    kk: { name: 'Діңкелеген', def: 'Физикалық, ақыл-ой және рухани күштердің толық, абсолютті таусылуы.', advice: 'Барлық істерді тоқтатыңыз. Денеңіз демалысты талап етеді: ұйықтаңыз, жатыңыз және гаджеттерді өшіріңіз.' }
  },
  {
    x: 4, y: 1,
    en: { name: 'Fatigued', def: 'Feeling tired and weak as a result of hard work or prolonged stress.', advice: 'Restore energy systematically. Hydrate, take a warm shower, and sleep early tonight.' },
    ru: { name: 'Переутомленный', def: 'Сильная усталость из-за тяжелой работы или длительного напряжения.', advice: 'Восстановитесь физически. Поспите, выпейте чистой воды и лягте спать пораньше.' },
    kk: { name: 'Қатты шаршаған', def: 'Ауыр жұмыс немесе ұзақ уақыт бойы шиеленістен туындаған қатты шаршау.', advice: 'Күшіңізді жүйелі түрде қалпына келтіріңіз: су ішіңіз, жылы душ қабылдаңыз және ерте ұйықтаңыз.' }
  },
  {
    x: 5, y: 1,
    en: { name: 'Mellow', def: 'Pleasantly soft, calm, relaxed, and free from harshness or stress.', advice: 'Enjoy the warmth. Listen to soft music, have a gentle conversation, or simply rest.' },
    ru: { name: 'Мягкий', def: 'Приятно спокойное, расслабленное состояние без резких эмоций и стресса.', advice: 'Насладитесь мягкостью. Послушайте спокойную музыку, проведите приятный разговор или отдохните.' },
    kk: { name: 'Жұмсақ', def: 'Шұғыл эмоциялар мен күйзеліссіз жағымды тыныш, босаңсыған күй.', advice: 'Осы жұмсақтықтан ләззат алыңыз. Баяу музыка тыңдаңыз, жағымды әңгіме айтыңыз немесе тынығыңыз.' }
  },
  {
    x: 6, y: 1,
    en: { name: 'Thoughtful', def: 'Showing consideration for others or deeply lost in reflective thinking.', advice: 'Write in a journal. This quiet state is ideal for organizing thoughts and self-reflection.' },
    ru: { name: 'Задумчивый', def: 'Глубокое погружение в размышления или заботливое отношение к окружающим.', advice: 'Сделайте записи в дневнике. Это тихое состояние идеально для самоанализа и упорядочивания мыслей.' },
    kk: { name: 'Ойлы', def: 'Ойға терең шому немесе айналадағыларға қамқорлық таныту күйі.', advice: 'Күнделікке жазыңыз. Бұл тыныш күй өзіңізді талдау және ойларды жүйелеу үшін өте қолайлы.' }
  },
  {
    x: 7, y: 1,
    en: { name: 'Peaceful', def: 'Free from disturbance; quiet, stable, and emotionally tranquil.', advice: 'Breathe and reflect. Express mental appreciation for this moment of absolute safety and quiet.' },
    ru: { name: 'Мирный', def: 'Свободный от беспокойств; спокойный, стабильный и гармоничный настрой.', advice: 'Дышите и созерцайте. Мысленно поблагодарите за этот момент абсолютной безопасности и покоя.' },
    kk: { name: 'Бейбіт / Тыныш', def: 'Мазасыздықтан ада; тыныш, тұрақты және үйлесимді көңіл-күй.', advice: 'Дем алыңыз және бақылаңыз. Осы абсолютті қауіпсіздік пен тыныштық сәті үшін іштей риза болыңыз.' }
  },
  {
    x: 8, y: 1,
    en: { name: 'Comfy', def: 'Feeling warm, physically comfortable, cozy, and highly secure.', advice: 'Snuggle in. Allow yourself to physically rest and fully enjoy the comfortable setting.' },
    ru: { name: 'Уютный', def: 'Ощущение тепла, физического удобства, мягкости и полной безопасности.', advice: 'Окутайте себя уютом. Позвольте телу полностью расслабиться в комфортной обстановке.' },
    kk: { name: 'Жайлы', def: 'Жылы, қолайлы, қауіпсіз және жайлы үй жылылығы сезімі.', advice: 'Өзіңізге жайлылық сыйлаңыз. Денеңізді ыңғайлы жағдайда толық босаңсытуға мүмкінитьік беріңіз.' }
  },
  {
    x: 9, y: 1,
    en: { name: 'Carefree', def: 'Free from anxiety, heavy responsibilities, or worries; light.', advice: 'Enjoy the lightness. Live in the moment, laugh, and let go of planning for a while.' },
    ru: { name: 'Беззаботный', def: 'Свободный от тревог, тяжелых обязательств или беспокойств; легкий настрой.', advice: 'Насладитесь легкостью. Живите моментом, смейтесь и отложите планирование на время.' },
    kk: { name: 'Қамсыз', def: 'Алаңдаушылықтан, ауыр міндеттемелерден немесе уайымнан ада; жеңіл көңіл-күй.', advice: 'Жеңілдіктен ләззат алыңыз. Осы сәтпен өмір сүріңіз, күліңіз және жоспарлауды уақытша тоқтатыңыз.' }
  },

  // --- ROW 0 (Energy = 1, Y = 0) ---
  {
    x: 0, y: 0,
    en: { name: 'Despair', def: 'The complete loss or absence of hope; deep emotional darkness.', advice: 'Connect with human warmth. Do not carry this alone; reach out to a professional or loved one.' },
    ru: { name: 'Отчаяние', def: 'Полная потеря или полное отсутствие надежды; глубокая душевная тьма.', advice: 'Обратитесь за теплом к людям. Не несите это в одиночку; поговорите с терапевтом или близким.' },
    kk: { name: 'Үмітсіздік', def: 'Үміттің толық жоғалуы немесе мүлдем болмауы; терең рухани қараңғылық.', advice: 'Адамдардан жылылық іздеңіз. Мұны жалғыз көтермеңіз; маманмен немесе жақын адамыңызбен сөйлесіңіз.' }
  },
  {
    x: 1, y: 0,
    en: { name: 'Hopeless', def: 'Feeling that there is no hope, no solution, and no possibility of success.', advice: 'Focus only on the next 15 minutes. Break life down into small survival intervals.' },
    ru: { name: 'Безнадежный', def: 'Ощущение отсутствия выхода, решения и всякой возможности успеха.', advice: 'Сфокусируйтесь только на следующих 15 минутах. Разбейте жизнь на микроинтервалы.' },
    kk: { name: 'Шарасыз', def: 'Шығар жолдың, шешімнің және кез келген сәттілік мүмкіндігінің жоқтығын сезіну.', advice: 'Тек келесі 15 минутқа назар аударыңыз. Өмірді кішкентай ғана аралықтарға бөліңіз.' }
  },
  {
    x: 2, y: 0,
    en: { name: 'Desolate', def: 'Feeling completely empty, isolated, joyless, and abandoned.', advice: 'Be warm to yourself. Create a safe physical harbor; wrap up warm, sip water, ...' },
    ru: { name: 'Опустошенный', def: 'Ощущение полной пустоты, изолированности, безрадостности и покинутости.', advice: 'Согрейте себя. Создайте безопасную гавань: завернитесь в плед, выпейте чаю, послушайте звуки природы.' },
    kk: { name: 'Қаңыраған', def: 'Толық бостық, оқшаулану, қуанышсыздық және жалғыз қалу сезімі.', advice: 'Өзіңізді жылытыңыз. Қауіпсіз орта жасаңыз: пледке ораныңыз, шай ішіңіз, табиғат дыбыстарын тыңдаңыз.' }
  },
  {
    x: 3, y: 0,
    en: { name: 'Spent', def: 'Having used up all mental or emotional energy; temporarily empty.', advice: 'Go into absolute quiet mode. Do not read or analyze; let your brain rest in silence.' },
    ru: { name: 'Выжатый', def: 'Полное расходование душевной и умственной энергии; временная пустота.', advice: 'Перейдите в режим тишины. Не анализируйте ничего; позвольте мозгу отдохнуть без информации.' },
    kk: { name: 'Босаған', def: 'Рухани және ақыл-ой қуатының толық таусылуы; уақытша бостық сезімі.', advice: 'Тыныштық режиміне өтіңіз. Ештеңені талдамаңыз; миыңызға ақпаратсыз демалуға мүмкіндік беріңіз.' }
  },
  {
    x: 4, y: 0,
    en: { name: 'Drained', def: 'Deprived of strength, vitality, or cognitive resources due to stress.', advice: 'Recharge physically. Sleep, drink clean water, and stay away from screens.' },
    ru: { name: 'Опустошенный', def: 'Лишение сил, жизненного тонуса и внимания вследствие длительной нагрузки.', advice: 'Восстановитесь физически. Поспите, выпейте чистой воды и держитесь подальше от экранов.' },
    kk: { name: 'Сарқылған', def: 'Ұзақ уақыт бойы күштің, өмірлік тонустың және зейіннің таусылуы.', advice: 'Физикалық тұрғыдан қалпына келіңіз. Ұйықтаңыз, таза су ішіңіз және экрандардан аулақ болыңыз.' }
  },
  {
    x: 5, y: 0,
    en: { name: 'Sleepy', def: 'Needing or ready for sleep; experiencing low physiological arousal.', advice: 'Go to sleep! Do not fight your body; close the app, turn off the lights, and sleep.' },
    ru: { name: 'Сонный', def: 'Потребность во сне; состояние низкой физиологической активности.', advice: 'Ложитесь спать! Не боритесь с организмом: закройте приложение, выключите свет и спите.' },
    kk: { name: 'Ұйқылы', def: 'Ұйқыға қажеттілік; төмен физиологиялық белсенділік күйі.', advice: 'Ұйықтаңыз! Денеңізбен күреспеңіз: қосымшаны жауып, жарықты өшіріп, ұйықтаңыз.' }
  },
  {
    x: 6, y: 0,
    en: { name: 'Complacent', def: 'Feeling uncritical satisfaction with oneself or one\'s achievements.', advice: 'Stay aware. Enjoy the peace but remain open to constructive feedback when things change.' },
    ru: { name: 'Самодовольный', def: 'Несклонное к критике чувство полного удовлетворения собой или делами.', advice: 'Сохраняйте осознанность. Наслаждайтесь покоем, но не теряйте гибкости к изменениям.' },
    kk: { name: 'Тоқмейіл', def: 'Өзіне немесе істеріне деген сынсыз толық қанағаттану сезімі.', advice: 'Саналылықты сақтаңыз. Тыныштықтан ләззат алыңыз, бірақ өзгерістерге дайын болыңыз.' }
  },
  {
    x: 7, y: 0,
    en: { name: 'Tranquil', def: 'Free from disturbance, noise, or agitation; deeply calm.', advice: 'Savor the serenity. It is an amazing state for deep meditation or deep rest.' },
    ru: { name: 'Спокойный', def: 'Свободный от волнений, шума или тревог; умиротворенное состояние.', advice: 'Насладитесь безмятежностью. Прекрасный момент для медитации или восстановительного сна.' },
    kk: { name: 'Бейқұт', def: 'Уайымнан, шудан немесе алаңдаушылықтан ада; терең тыныштық күйі.', advice: 'Бейқұттықтан ләззат алыңыз. Медитация жасау немесе күш жинап демалу үшін тамаша сәт.' }
  },
  {
    x: 8, y: 0,
    en: { name: 'Cozy', def: 'Feeling warm, comfortable, safe, sheltered, and deeply content.', advice: 'Stay comfortable. Read a book, drink tea, and let your body absorb the safety.' },
    ru: { name: 'Уютный', def: 'Теплое, комфортное, безопасное состояние домашнего тепла.', advice: 'Наслаждайтесь моментом. Почитайте книгу, выпейте чаю и дайте телу напитаться безопасностью.' },
    kk: { name: 'Жайлы', def: 'Жылы, қолайлы, қауіпсіз және жайлы үй жылылығы сезімі.', advice: 'Осы сәттен ләззат алыңыз. Кітап оқыңыз, шай ішіңіз және денеңіздің қауіпсіздікті сезінуіне жол беріңіз.' }
  },
  {
    x: 9, y: 0,
    en: { name: 'Serene', def: 'Calm, peaceful, untroubled, and beautifully clear-minded.', advice: 'Radiate peace. Let this stable inner harmony guide your perspective on your life plans.' },
    ru: { name: 'Безмятежный', def: 'Спокойный, мирный, ничем не тревожимый, с чистым и ясным умом.', advice: 'Излучайте покой. Пусть эта стабильная гармония поможет вам взглянуть на планы на жизнь.' },
    kk: { name: 'Нұрлы (Мазасызсыз)', def: 'Тыныш, бейбіт, ештеңе мазаламайтын, таза және айқын ақыл-ой күйі.', advice: 'Тыныштық таратыңыз. Осы тұрақты үйлесімділік өмірлік жоспарларыңызға жаңаша қарауға комектессін.' }
  }
];

// Локализованные системные тексты
const t = {
  en: {
    title: "Interactive Mood Meter",
    subtitle: "How are you feeling?",
    recognize: "Recognize",
    understand: "Understand",
    label: "Label",
    express: "Express",
    regulate: "Regulate",
    aboutTitle: "About Mood Meter",
    aboutText: "Created by the Yale Center for Emotional Intelligence, the Mood Meter helps us build emotional intelligence. It is plotted along two axes: Pleasantness (horizontal, -5 to +5) and Energy (vertical, -5 to +5). By identifying our position, we can understand and regulate our emotions effectively.",
    searchPlaceholder: "Search for an emotion...",
    showNames: "Show text in cells",
    selectedEmotion: "Selected Emotion",
    quadrant: "Quadrant",
    coords: "Coordinates",
    energy: "Energy",
    pleasantness: "Pleasantness",
    definition: "Definition",
    regulationAdvice: "How to Regulate",
    logMood: "Log this mood",
    moodJournal: "Mood Journal",
    journalPlaceholder: "Add a short note about why you feel this way...",
    save: "Save Entry",
    noEntries: "No journal entries yet. Tap an emotion and log it!",
    statistics: "Quadrant Statistics",
    delete: "Delete",
    all: "All",
    redTitle: "High Energy, Low Pleasantness (Red)",
    redDesc: "High Alert state. Feelings like anger, anxiety, or frustration. Ideal for identifying barriers or injustices but requires calming to prevent burnout.",
    yellowTitle: "High Energy, High Pleasantness (Yellow)",
    yellowDesc: "Peak Performance state. Feelings like joy, motivation, or excitement. Perfect for brainstorming, starting tasks, and socializing.",
    blueTitle: "Low Energy, Low Pleasantness (Blue)",
    blueDesc: "Reflective state. Feelings like sadness, exhaustion, or loneliness. Helpful for deep analytical thinking, empathy, and resting.",
    greenTitle: "Low Energy, High Pleasantness (Green)",
    greenDesc: "Restorative state. Feelings like calm, satisfaction, or peace. Best for building relationships, resting, and reflecting.",
    langName: "English",
    clearLogs: "Clear history",
    copied: "Copied!",
    alternateNames: "Names in other languages"
  },
  ru: {
    title: "Интерактивная шкала настроения",
    subtitle: "Как вы себя чувствуете?",
    recognize: "Распознать",
    understand: "Понять",
    label: "Назвать",
    express: "Выразить",
    regulate: "Регулировать",
    aboutTitle: "О Шкале Настроения",
    aboutText: "Шкала настроения (Mood Meter), созданная Йельским центром эмоционального интеллекта, помогает развивать эмоциональную осознанность. Она разделена на две оси: Приятность (горизонтальная, от -5 до +5) и Энергия (вертикальная, от -5 до +5). Понимая свое положение на шкале, мы можем эффективно управлять своими реакциями.",
    searchPlaceholder: "Поиск эмоции (на любом языке)...",
    showNames: "Показывать текст в ячейках",
    selectedEmotion: "Выбранная эмоция",
    quadrant: "Квадрант",
    coords: "Координаты",
    energy: "Энергия",
    pleasantness: "Приятность",
    definition: "Определение",
    regulationAdvice: "Как регулировать состояние",
    logMood: "Зафиксировать настроение",
    moodJournal: "Дневник настроения",
    journalPlaceholder: "Добавьте заметку о том, почему вы чувствуете себя так...",
    save: "Сохранить запись",
    noEntries: "Записей пока нет. Выберите эмоцию на сетке и сохраните ее!",
    statistics: "Статистика по квадрантам",
    delete: "Удалить",
    all: "Все",
    redTitle: "Высокая энергия, Низкая приятность (Красный)",
    redDesc: "Состояние тревоги/действия. Эмоции: гнев, стресс, тревога. Полезно для защиты границ, но требует бережного успокоения для предотвращения выгорания.",
    yellowTitle: "Высокая энергия, Высокая приятность (Желтый)",
    yellowDesc: "Состояние высокой продуктивности. Эмоции: радость, мотивация, вдохновение. Идеально подходит для работы в команде, творчества и старта проектов.",
    blueTitle: "Низкая энергия, Низкая приятность (Синий)",
    blueDesc: "Состояние рефлексии. Эмоции: грусть, усталость, уныние. Помогает глубокому анализу ошибок, проявлению эмпатии и тихому восстановлению.",
    greenTitle: "Низкая энергия, Высокая приятность (Зеленый)",
    greenDesc: "Состояние восстановления. Эмоции: спокойствие, уют, безмятежность. Лучшее время для укрепления доверительных связей, отдыха и планирования.",
    langName: "Русский",
    clearLogs: "Очистить историю",
    copied: "Скопировано!",
    alternateNames: "Названия на других языках"
  },
  kk: {
    title: "Интерактивті көңіл-күй шкаласы",
    subtitle: "Өзіңізді қалай сезінесіз?",
    recognize: "Тану",
    understand: "Түсіну",
    label: "Атау",
    express: "Білдіру",
    regulate: "Реттеу",
    aboutTitle: "Көңіл-күй шкаласы туралы",
    aboutText: "Йель эмоционалды интеллект орталығы жасап шығарған бұл шкала эмоционалды сананы дамытуға көмектеседі. Ол екі өске бөліген: Жағымдылық (көлденең, -5-тен +5-ке дейін) и Қуат (тік, -5-тен +5-ке дейін). Шкаладағы орнымызды анықтау арқылы біз өз эмоцияларымызды тиімді басқара аламыз.",
    searchPlaceholder: "Көңіл-күйді іздеу (кез келген тілде)...",
    showNames: "Ұяшықтарда мәтінді көрсету",
    selectedEmotion: "Тандалған эмоция",
    quadrant: "Квадрант",
    coords: "Координаттар",
    energy: "Қуат",
    pleasantness: "Жағымдылық",
    definition: "Анықтамасы",
    regulationAdvice: "Күйді қалай реттеуге болады",
    logMood: "Көңіл-күйді тіркеу",
    moodJournal: "Көңіл-күй күнделігі",
    journalPlaceholder: "Неліктен олай сезінетініңіз туралы қысқаша жазыңыз...",
    save: "Жазбаны сақтау",
    noEntries: "Жазбалар әлі жоқ. Көңіл-күйді таңдап, оны күнделікке сақтаңыз!",
    statistics: "Квадранттар бойынша статистика",
    delete: "Өшіру",
    all: "Барлығы",
    redTitle: "Жоғары қуат, Төмен жағымдылық (Қызыл)",
    redDesc: "Қорғаныс/әрекет күйі. Эмоциялар: ашу, күйзеліс, мазасыздық. Шекараларды қорғауға пайдалы, бірақ күйіп кетпеу үшін тыныштандыруды қажет етеді.",
    yellowTitle: "Жоғары қуат, Жоғары жағымдылық (Сары)",
    yellowDesc: "Белсенді өнімділік күйі. Эмоциялар: қуаныш, ынта, шабыт. Шығармашылыққа, бірлескен жұмысқа және жаңа жобаларды бастауға өте қолайлы.",
    blueTitle: "Төмен қуат, Төмен жағымдылық (Көк)",
    blueDesc: "Рефлексия (ойлану) күйі. Эмоциялар: мұң, шаршау, жалғыздық. Ойды жинақтауға, қателіктерді талдауға, эмпатияға және тыныш демалуға көмектеседі.",
    greenTitle: "Төмен қуат, Жоғары жағымдылық (Жасыл)",
    greenDesc: "Қалпына келу күйі. Эмоциялар: сабырлық, жайлылық, бейқұттық. Жақындармен қарым-қатынасты нығайтуға, демалуға және жоспарлауға ең жақсы уақыт.",
    langName: "Қазақша",
    clearLogs: "Тарихты тазалау",
    copied: "Көшірілді!",
    alternateNames: "Басқа тілдердегі атаулары"
  }
};

type EmotionLang = { name: string; def: string; advice: string };
type Emotion = { x: number; y: number; en: EmotionLang; ru: EmotionLang; kk: EmotionLang };
type LogEntry = { id: number; emotionKey: string; x: number; y: number; color: string; note: string; timestamp: string };

export default function App() {
  const [lang, setLang] = useState<'en' | 'ru' | 'kk'>('ru'); // По умолчанию русский
  const [selected, setSelected] = useState<Emotion | null>(null);
  const [search, setSearch] = useState('');
  const [showNames, setShowNames] = useState(true);
  const [journalNote, setJournalNote] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showAbout, setShowAbout] = useState(false);
  const [contrastMode, setContrastMode] = useState('auto'); // 'auto' (черно-белый по яркости) или 'white' (чисто белый)

  // --- Аутентификация ---
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // 1. Проверка сессии при монтировании + подписка на изменения авторизации
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) fetchLogs();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session); // Для отладки в консоли
      setUser(session?.user ?? null);
      setAuthLoading(false);

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // Очищаем хэш в адресной строке после разбора токена из письма
        window.history.replaceState(null, '', window.location.pathname);
      }

      if (session?.user) {
        fetchLogs();
      } else {
        setLogs([]);
      }
    });

    // Автовыбор первой эмоции (Enraged) по умолчанию
    setSelected(emotionsData[0]);

    return () => subscription.unsubscribe();
  }, []);

  // 2. Аутентификация (вход / регистрация)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) alert(error.message);
      else alert(
        lang === 'ru'
          ? 'Проверьте почту для подтверждения регистрации!'
          : lang === 'kk'
            ? 'Тіркеуді растау үшін поштаңызды тексеріңіз!'
            : 'Check your email to confirm your registration!'
      );
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setLogs([]);
  };

  // 3. Загрузка логов из Supabase
  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formattedLogs: LogEntry[] = data.map((log: any) => ({
        id: log.id,
        emotionKey: log.emotion_key,
        x: log.x,
        y: log.y,
        color: log.color,
        note: log.note,
        timestamp: new Date(log.created_at).toLocaleString(
          lang === 'en' ? 'en-US' : lang === 'ru' ? 'ru-RU' : 'kk-KZ'
        )
      }));
      setLogs(formattedLogs);
    } else if (error) {
      console.error('Error fetching logs', error);
    }
  };

// Поиск и фильтрация эмоций
const filteredEmotions = useMemo(() => {
  const query = search.trim().toLowerCase();
  return emotionsData.map(item => ({
    ...item,
    // Если запрос пустой (!query), isMatched всегда будет true
    isMatched: !query || 
      item.en.name.toLowerCase().includes(query) ||
      item.ru.name.toLowerCase().includes(query) ||
      item.kk.name.toLowerCase().includes(query)
  }));
}, [search]);

  // Функция для расчета точного и красивого цвета градиента шкалы
  // Вычисляет радиальное расстояние до центра сопряжения квадрантов для плавности (от ярче к темнее)
  const getCellColor = (x: number, y: number) => {
    let center_x, center_y;
    let hueStart, hueEnd, satStart, satEnd, lightStart, lightEnd;

    if (x < 5 && y >= 5) {
      // КРАСНЫЙ КВАДРАНТ (Top-Left)
      center_x = 4;
      center_y = 5;
      hueStart = 15;      // Ярко-оранжево-красный в центре
      hueEnd = 350;       // Глубокий темно-бордовый у краев
      satStart = 100;
      satEnd = 100;
      lightStart = 64;    // Очень яркий у центра
      lightEnd = 20;      // Темный у краев
    } else if (x >= 5 && y >= 5) {
      // ЖЕЛТЫЙ КВАДРАНТ (Top-Right)
      center_x = 5;
      center_y = 5;
      hueStart = 58;      // Ярко-лимонно-желтый в центре
      hueEnd = 36;        // Теплый золотисто-оранжевый у краев
      satStart = 100;
      satEnd = 100;
      lightStart = 62;    // Яркий у центра
      lightEnd = 45;      // Глубокий золотой у краев
    } else if (x < 5 && y <= 4) {
      // СИНИЙ КВАДРАНТ (Bottom-Left)
      center_x = 4;
      center_y = 4;
      hueStart = 205;     // Чистый небесно-голубой у центра
      hueEnd = 232;       // Глубокий темный индиго/ультрамарин у краев
      satStart = 90;
      satEnd = 100;
      lightStart = 65;    // Нежный светлый у центра
      lightEnd = 16;      // Очень темный у краев
    } else {
      // ЗЕЛЕНЫЙ КВАДРАНТ (Bottom-Right)
      center_x = 5;
      center_y = 4;
      hueStart = 142;     // Светлая свежая мята у центра
      hueEnd = 120;       // Насыщенный лесной зеленый у краев
      satStart = 72;
      satEnd = 95;
      lightStart = 60;    // Светлый пастельный у центра
      lightEnd = 16;      // Темно-зеленый у краев
    }

    const dx = Math.abs(x - center_x);
    const dy = Math.abs(y - center_y);
    
    // Радиальное евклидово расстояние для ультра-гладкого кругового распределения
    const dist = Math.sqrt(dx * dx + dy * dy);
    const tVal = Math.min(dist / 5.6568, 1.0); // Нормализация к 0..1 (5.6568 - это Math.sqrt(32))

    // Вычисляем тон (Hue), насыщение (Saturation) и яркость (Lightness)
    let hue;
    if (hueStart === 15 && hueEnd === 350) {
      // Плавный переход тона через красный спектр
      hue = 15 - tVal * 25; 
      if (hue < 0) hue += 360;
    } else {
      hue = hueStart + tVal * (hueEnd - hueStart);
    }

    const sat = satStart + tVal * (satEnd - satStart);
    const light = lightStart + tVal * (lightEnd - lightStart);

    return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%)`;
  };

  // Определение идеального цвета текста для безупречного контраста (Оставляем для других мест, если нужно)
  const getCellContrastColor = (x: number, y: number) => {
    if (contrastMode === 'white') return '#ffffff';
    
    // Вычисляем приблизительную яркость ячейки
    let center_x, center_y, lightStart, lightEnd;
    if (x < 5 && y >= 5) {
      center_x = 4; center_y = 5; lightStart = 64; lightEnd = 20;
    } else if (x >= 5 && y >= 5) {
      center_x = 5; center_y = 5; lightStart = 62; lightEnd = 45;
    } else if (x < 5 && y <= 4) {
      center_x = 4; center_y = 4; lightStart = 65; lightEnd = 16;
    } else {
      center_x = 5; center_y = 4; lightStart = 60; lightEnd = 16;
    }

    const dx = Math.abs(x - center_x);
    const dy = Math.abs(y - center_y);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const tVal = Math.min(dist / 5.6568, 1.0);
    const light = lightStart + tVal * (lightEnd - lightStart);

    // В желтом спектре желтый цвет выглядит очень ярким даже при 50% яркости
    if (x >= 5 && y >= 5) {
      return light >= 48 ? '#0f172a' : '#ffffff';
    }
    return light >= 54 ? '#0f172a' : '#ffffff';
  };

  // Определение квадранта
  const getQuadrantInfo = (x: number, y: number) => {
    if (x < 5 && y >= 5) {
      return {
        key: 'red',
        colorClass: 'text-red-500 bg-red-50 border-red-200',
        title: t[lang].redTitle,
        desc: t[lang].redDesc
      };
    } else if (x >= 5 && y >= 5) {
      return {
        key: 'yellow',
        colorClass: 'text-amber-600 bg-amber-50 border-amber-200',
        title: t[lang].yellowTitle,
        desc: t[lang].yellowDesc
      };
    } else if (x < 5 && y < 5) {
      return {
        key: 'blue',
        colorClass: 'text-blue-600 bg-blue-50 border-blue-200',
        title: t[lang].blueTitle,
        desc: t[lang].blueDesc
      };
    } else {
      return {
        key: 'green',
        colorClass: 'text-green-600 bg-green-50 border-green-200',
        title: t[lang].greenTitle,
        desc: t[lang].greenDesc
      };
    }
  };

  // 4. Сохранение новой записи в Supabase
  const handleLogMood = async () => {
    if (!selected || !user) return;
    const computedBg = getCellColor(selected.x, selected.y);

    const { error } = await supabase.from('mood_logs').insert([
      {
        emotion_key: selected.en.name,
        x: selected.x,
        y: selected.y,
        color: computedBg,
        note: journalNote.trim()
      }
    ]);

    if (!error) {
      await fetchLogs();
      setJournalNote('');
    } else {
      console.error('Error saving log', error);
      alert(error.message);
    }
  };

  // 5. Удаление записи из Supabase
  const handleDeleteLog = async (id: number) => {
    const { error } = await supabase.from('mood_logs').delete().eq('id', id);
    if (!error) {
      setLogs(logs.filter(log => log.id !== id));
    } else {
      console.error('Error deleting log', error);
    }
  };

  // 6. Очистка всей истории в Supabase
  const handleClearLogs = async () => {
    const confirmed = window.confirm(
      lang === 'ru' 
        ? 'Вы уверены, что хотите очистить всю историю?' 
        : lang === 'kk' 
          ? 'Барлық тарихты өшіргіңіз келетініне сенімдісіз бе?' 
          : 'Are you sure you want to clear all history?'
    );
    if (!confirmed || !user) return;

    const { error } = await supabase.from('mood_logs').delete().eq('user_id', user.id);
    if (!error) {
      setLogs([]);
    } else {
      console.error('Error clearing logs', error);
      alert(error.message);
    }
  };

  // Статистика квадрантов по логам
  const stats = useMemo(() => {
    const counts = { red: 0, yellow: 0, blue: 0, green: 0 };
    logs.forEach(log => {
      if (log.x < 5 && log.y >= 5) counts.red++;
      else if (log.x >= 5 && log.y >= 5) counts.yellow++;
      else if (log.x < 5 && log.y < 5) counts.blue++;
      else counts.green++;
    });
    const total = logs.length || 1;
    return {
      red: { count: counts.red, percent: Math.round((counts.red / total) * 100) },
      yellow: { count: counts.yellow, percent: Math.round((counts.yellow / total) * 100) },
      blue: { count: counts.blue, percent: Math.round((counts.blue / total) * 100) },
      green: { count: counts.green, percent: Math.round((counts.green / total) * 100) }
    };
  }, [logs]);

  // Локализованное название квадранта
  const getQuadrantNameOnly = (x: number, y: number) => {
    if (x < 5 && y >= 5) return lang === 'ru' ? 'Красный (Тревога / Активность)' : lang === 'kk' ? 'Қызыл (Қорғаныс / Алаңдау)' : 'Red (High Energy, Low Pleasant)';
    if (x >= 5 && y >= 5) return lang === 'ru' ? 'Желтый (Продуктивность / Радость)' : lang === 'kk' ? 'Сары (Белсенділік / Өнім)' : 'Yellow (High Energy, High Pleasant)';
    if (x < 5 && y < 5) return lang === 'ru' ? 'Синий (Размышление / Грусть)' : lang === 'kk' ? 'Көк (Ойлану / Мұң)' : 'Blue (Low Energy, Low Pleasant)';
    return lang === 'ru' ? 'Зеленый (Покой / Восстановление)' : lang === 'kk' ? 'Жасыл (Тыныштық / Қалпына келу)' : 'Green (Low Energy, High Pleasant)';
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-xl text-white shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-950 to-slate-700 bg-clip-text text-transparent">
                {t[lang].title}
              </h1>
              <p className="text-xs text-slate-500 font-medium">{t[lang].subtitle}</p>
            </div>
          </div>




          <div className="flex items-center gap-3 flex-wrap">
            {/* Кнопка "О шкале" */}
            <button 
              onClick={() => setShowAbout(!showAbout)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-all duration-200"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t[lang].aboutTitle}</span>
            </button>

            {/* Переключатель языков */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              {['en', 'ru', 'kk'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l as 'en' | 'ru' | 'kk')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    lang === l 
                      ? 'bg-white text-indigo-600 shadow-sm font-black' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {/* НОВЫЙ БЛОК: Почта пользователя и кнопка выхода */}
              {user && (
                <div className="flex items-center gap-3 border-l border-slate-200 pl-3 ml-1">
                  <span className="text-xs font-medium text-slate-500 hidden sm:inline-block">
                    {user.email}
                  </span>
                  <button 
                    onClick={() => supabase.auth.signOut()} 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-semibold text-slate-600 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Выйти</span>
                  </button>
                </div>
              )}
            </div>



            {/* Пользователь / Выход */}
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-semibold text-slate-600 transition-all duration-200"
                title={user.email}
              >
                {lang === 'ru' ? 'Выйти' : lang === 'kk' ? 'Шығу' : 'Sign out'}
              </button>
            )}
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

        {/* Экран загрузки сессии */}
        {authLoading && (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Форма входа / регистрации, если пользователь не авторизован */}
        {!authLoading && !user && (
          <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mt-12 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-950 text-center">
              {isSignUp
                ? (lang === 'ru' ? 'Регистрация' : lang === 'kk' ? 'Тіркелу' : 'Sign Up')
                : (lang === 'ru' ? 'Вход' : lang === 'kk' ? 'Кіру' : 'Sign In')}
            </h2>
            <form onSubmit={handleAuth} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={lang === 'ru' ? 'Пароль' : lang === 'kk' ? 'Құпиясөз' : 'Password'}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
              >
                {isSignUp
                  ? (lang === 'ru' ? 'Зарегистрироваться' : lang === 'kk' ? 'Тіркелу' : 'Sign Up')
                  : (lang === 'ru' ? 'Войти' : lang === 'kk' ? 'Кіру' : 'Sign In')}
              </button>
            </form>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              {isSignUp
                ? (lang === 'ru' ? 'Уже есть аккаунт? Войти' : lang === 'kk' ? 'Аккаунтыңыз бар ма? Кіру' : 'Already have an account? Sign in')
                : (lang === 'ru' ? 'Нет аккаунта? Зарегистрироваться' : lang === 'kk' ? 'Аккаунтыңыз жоқ па? Тіркелу' : "Don't have an account? Sign up")}
            </button>
          </div>
        )}

        {!authLoading && user && (
        <>
        {/* Описание Йельской модели (сворачиваемое) */}
        {showAbout && (
          <div className="mb-6 bg-indigo-50/80 border border-indigo-100 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 shadow-sm animate-fadeIn">
            <div className="flex gap-4">
              <div className="bg-white p-2.5 rounded-xl text-indigo-600 self-start shadow-sm border border-indigo-100">
                <Brain className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-indigo-950 text-base flex items-center gap-2">
                  {t[lang].aboutTitle}
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">RULER Method</span>
                </h3>
                <p className="text-sm text-indigo-900/90 leading-relaxed max-w-4xl">
                  {t[lang].aboutText}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3">
                  {[
                    { step: 'R', title: t[lang].recognize, desc: lang === 'ru' ? 'Что я чувствую физически?' : lang === 'kk' ? 'Денемде не сезіп тұрмын?' : 'What do I feel physically?' },
                    { step: 'U', title: t[lang].understand, desc: lang === 'ru' ? 'Какова причина эмоции?' : lang === 'kk' ? 'Эмоцияның себебі неде?' : 'What triggered this state?' },
                    { step: 'L', title: t[lang].label, desc: lang === 'ru' ? 'Найти точное слово в сетке' : lang === 'kk' ? 'Дәл сөзді тауып атау' : 'Pick the precise word' },
                    { step: 'E', title: t[lang].express, desc: lang === 'ru' ? 'Как безопасно выплеснуть?' : lang === 'kk' ? 'Қалай қауіпсіз білдіруге болады?' : 'Express safely to others' },
                    { step: 'R', title: t[lang].regulate, desc: lang === 'ru' ? 'Использовать совет в карточке' : lang === 'kk' ? 'Түзету кеңесін қолдану' : 'Use advice to shift state' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/80 p-3 rounded-xl border border-indigo-100/40">
                      <div className="font-black text-indigo-600 text-lg">{item.step}</div>
                      <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowAbout(false)}
              className="absolute top-3 right-3 text-indigo-400 hover:text-indigo-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* ОСНОВНОЙ БЛОК: Сетка и Детали */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ЛЕВАЯ КОЛОНКА (СЕТКА + УПРАВЛЕНИЕ) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* УПРАВЛЕНИЕ СЕТКОЙ (Поиск, Отображение текста) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Поиск */}
              <div className="relative w-full md:max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder={t[lang].searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Настройки видимости названий и контраста */}
              <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-end">
                <button 
                  onClick={() => setShowNames(!showNames)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
                    showNames 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {showNames ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {t[lang].showNames}
                </button>
              </div>

            </div>

            {/* КАРТА / ШКАЛА СЕТКА */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              
              {/* Подсказка о горизонтальной прокрутке на малых экранах */}
              <div className="flex lg:hidden items-center justify-center gap-1.5 text-[10px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-lg py-1.5 px-3 mb-4 animate-pulse">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>{lang === 'ru' ? 'Прокручивайте сетку влево-вправо' : lang === 'kk' ? 'Кестені оңға-солға жылжытыңыз' : 'Scroll the grid horizontally'}</span>
              </div>

              {/* Метка: Энергия Высокая */}
              <div className="text-center text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center justify-center gap-1 select-none">
                <span>↑ {lang === 'ru' ? 'Высокая энергия' : lang === 'kk' ? 'Жоғары қуат' : 'High Energy'}</span>
              </div>

              <div className="flex gap-1 sm:gap-2">
                
                {/* Вертикальная ось Y (Энергия от +5 до -5) */}
                <div className="flex flex-col justify-between py-4 text-[10px] sm:text-xs font-bold text-slate-400 text-right w-6 select-none shrink-0">
                  {['+5', '+4', '+3', '+2', '+1', '-1', '-2', '-3', '-4', '-5'].map((num, i) => (
                    <div key={i} className="h-10 sm:h-12 flex items-center justify-end pr-1.5">{num}</div>
                  ))}
                </div>

                {/* Контейнер интерактивной сетки */}
                <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                  <div className="min-w-[850px] p-1 bg-slate-50 rounded-2xl border border-slate-200/50">
                    <div className="grid grid-cols-10 gap-1.5">
                      
                      {/* Отрендерим ячейки. */}
                      {Array.from({ length: 10 }).map((_, rowIdx) => {
                        const y = 9 - rowIdx; 
                        return (
                          <React.Fragment key={`row-${y}`}>
                            {Array.from({ length: 10 }).map((_, colIdx) => {
                              const x = colIdx;
                              const originalItem = emotionsData.find(item => item.x === x && item.y === y);
                              
                              const filterState = filteredEmotions.find(item => item.x === x && item.y === y);
                              const isMatched = filterState?.isMatched ?? true;
                              const isSelected = selected && selected.x === x && selected.y === y;

                              if (!originalItem) return <div key={`${x}-${y}`} className="aspect-square bg-slate-100 rounded-lg"></div>;

                              // Динамическое вычисление цвета ячейки
                              const computedBg = getCellColor(x, y);

                              return (
                                <button
                                  key={`${x}-${y}`}
                                  onClick={() => setSelected(originalItem)}
                                  style={{ 
                                    backgroundColor: computedBg,
                                    color: '#ffffff', 
                                    opacity: isMatched ? 1 : 0.12 
                                  }}
                                  className={`h-16 sm:h-[72px] rounded-lg flex flex-col items-center justify-center p-1.5 text-center transition-all duration-300 relative select-none hover:scale-105 active:scale-95 group shadow-sm overflow-hidden ${
                                    isSelected 
                                      ? 'ring-[3px] ring-slate-900 ring-offset-2 z-10 scale-105 shadow-md' 
                                      : 'hover:shadow-md'
                                  }`}
                                >
                                  {/* Отображение короткого текста */}
                                  {showNames ? (
                                    <span 
                                      className="text-[9px] min-[400px]:text-[10px] sm:text-[10.5px] font-extrabold leading-[12px] sm:leading-[13px] tracking-tight break-words hyphens-auto pointer-events-none transition-transform w-full h-full flex items-center justify-center"
                                      style={{
                                        color: '#ffffff', 
                                        textShadow: '1px 1px 1.5px #000000, -1px -1px 1.5px #000000, 1px -1px 1.5px #000000, -1px 1px 1.5px #000000, 0px 2px 3px rgba(0, 0, 0, 0.9)'
                                      }}
                                    >
                                      {originalItem[lang].name}
                                    </span>
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-white/70 pointer-events-none group-hover:scale-150 transition-all duration-200"></span>
                                  )}

                                  {/* Всплывающая подсказка при наведении */}
                                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30 w-64 sm:w-72 left-1/2 -translate-x-1/2">
                                    <div className="bg-slate-900/95 text-white text-[11px] p-3.5 rounded-xl shadow-xl border border-slate-700/80 backdrop-blur-sm whitespace-normal text-left">
                                      <div className="flex justify-between items-center border-b border-slate-700/80 pb-2 mb-2 gap-2">
                                        <span className="font-extrabold text-xs text-white">{originalItem[lang].name}</span>
                                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                          ({x - 5 >= 0 ? `+${x - 4}` : x - 5}, {y - 5 >= 0 ? `+${y - 4}` : y - 5})
                                        </span>
                                      </div>
                                      <div className="text-slate-200 leading-relaxed font-normal text-[11px]">
                                        {originalItem[lang].def}
                                      </div>
                                    </div>
                                    <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 -mt-1.5 border-r border-b border-slate-700/80"></div>
                                  </div>
                                </button>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Горизонтальная ось X (Приятность от -5 до +5) */}
                    <div className="grid grid-cols-10 gap-1.5 text-center text-[10px] sm:text-xs font-bold text-slate-400 mt-3 select-none">
                      {['-5', '-4', '-3', '-2', '-1', '+1', '+2', '+3', '+4', '+5'].map((num, i) => (
                        <div key={i}>{num}</div>
                      ))}
                    </div>

                  </div>
                </div>

              </div>

              {/* Метки осей внизу */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
                <span className="flex items-center gap-1">← {lang === 'ru' ? 'Неприятно' : lang === 'kk' ? 'Жайсыз сезім' : 'Unpleasant'}</span>
                <span className="text-slate-300 font-normal">X: {t[lang].pleasantness} | Y: {t[lang].energy}</span>
                <span className="flex items-center gap-1">{lang === 'ru' ? 'Приятно' : lang === 'kk' ? 'Жағымды сезім' : 'Pleasant'} →</span>
              </div>

              {/* Нижняя метка: Энергия Низкая */}
              <div className="text-center text-xs font-bold text-slate-400 tracking-widest uppercase mt-4 select-none">
                ↓ {lang === 'ru' ? 'Низкая энергия' : lang === 'kk' ? 'Төмен қуат' : 'Low Energy'}
              </div>

            </div>

          </div>

          {/* ПРАВАЯ КОЛОНКА (ДЕТАЛИ + ДНЕВНИК) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            
            {/* ДЕТАЛИ ВЫБРАННОЙ ЭМОЦИИ */}
            {selected && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                
                {/* Заголовок карточки с фоном выбранного цвета */}
                <div 
                  style={{ backgroundColor: getCellColor(selected.x, selected.y), color: '#ffffff' }}
                  className="p-6 transition-colors duration-300 relative"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-90 bg-black/20 py-1 px-3 rounded-full">
                      {getQuadrantNameOnly(selected.x, selected.y)}
                    </span>
                    <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                      X: {selected.x - 5 >= 0 ? `+${selected.x - 4}` : selected.x - 5}, Y: {selected.y - 5 >= 0 ? `+${selected.y - 4}` : selected.y - 5}
                    </span>
                  </div>

                  <h2 className="text-3xl font-black mt-4 leading-tight drop-shadow-sm text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    {selected[lang].name}
                  </h2>
                  
                  <p className="text-xs font-medium opacity-80 mt-1.5 text-white">
                    EN: <span className="font-bold">{selected.en.name}</span> | RU: <span className="font-bold">{selected.ru.name}</span> | KK: <span className="font-bold">{selected.kk.name}</span>
                  </p>
                </div>

                {/* Контент карточки */}
                <div className="p-6 space-y-5">
                  
                  {/* Определение */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {t[lang].definition}
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
                      {selected[lang].def}
                    </p>
                  </div>

                  {/* Квадрант Инфо */}
                  {(() => {
                    const quad = getQuadrantInfo(selected.x, selected.y);
                    return (
                      <div className={`p-4 rounded-xl border text-xs leading-relaxed ${quad.colorClass}`}>
                        <div className="font-black mb-1 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                          {quad.title}
                        </div>
                        <p className="font-medium opacity-95">{quad.desc}</p>
                      </div>
                    );
                  })()}

                  {/* Как регулировать */}
                  <div className="space-y-1.5 pt-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5" />
                      {t[lang].regulationAdvice}
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 font-semibold text-indigo-950">
                      {selected[lang].advice}
                    </p>
                  </div>

                  {/* Форма логирования для Дневника */}
                  <div className="border-t border-slate-100 pt-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {t[lang].logMood}
                    </h4>
                    <textarea
                      placeholder={t[lang].journalPlaceholder}
                      value={journalNote}
                      onChange={(e) => setJournalNote(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none h-16"
                    />
                    <button
                      onClick={handleLogMood}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      {t[lang].save}
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* ДНЕВНИК И СТАТИСТИКА */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-500" />
                  {t[lang].moodJournal}
                </h3>
                {logs.length > 0 && (
                  <button 
                    onClick={handleClearLogs}
                    className="text-[10px] text-red-500 hover:text-red-700 font-extrabold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t[lang].clearLogs}
                  </button>
                )}
              </div>

              {/* Статистика Квадрантов */}
              {logs.length > 0 && (
                <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t[lang].statistics}
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: 'red', name: lang === 'ru' ? 'Красный' : lang === 'kk' ? 'Қызыл' : 'Red', bg: 'bg-red-500' },
                      { key: 'yellow', name: lang === 'ru' ? 'Желтый' : lang === 'kk' ? 'Сары' : 'Yellow', bg: 'bg-amber-400' },
                      { key: 'blue', name: lang === 'ru' ? 'Синий' : lang === 'kk' ? 'Көк' : 'Blue', bg: 'bg-blue-500' },
                      { key: 'green', name: lang === 'ru' ? 'Зеленый' : lang === 'kk' ? 'Жасыл' : 'Green', bg: 'bg-green-500' }
                    ].map((item) => (
                      <div key={item.key} className="text-center space-y-1">
                        <div className="text-[10px] font-bold text-slate-500">{item.name}</div>
                        <div className="text-sm font-black text-slate-950">{stats[item.key as keyof typeof stats].percent}%</div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${stats[item.key as keyof typeof stats].percent}%` }}
                            className={`${item.bg} h-full rounded-full transition-all duration-500`}
                          ></div>
                        </div>
                        <div className="text-[9px] text-slate-400">({stats[item.key as keyof typeof stats].count})</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Список сохраненных логов */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
                {logs.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6 leading-relaxed font-medium">
                    {t[lang].noEntries}
                  </p>
                ) : (
                  logs.map((log) => {
                    const item = emotionsData.find(e => e.en.name === log.emotionKey);
                    const displayName = item ? item[lang].name : log.emotionKey;
                    
                    return (
                      <div 
                        key={log.id} 
                        className="bg-white border border-slate-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-all duration-200 group relative"
                      >
                        <div 
                          style={{ backgroundColor: log.color }}
                          className="w-4 h-4 rounded-full mt-1 shrink-0 shadow-sm"
                        ></div>

                        <div className="space-y-1 w-full pr-6">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="font-extrabold text-xs text-slate-950">
                              {displayName}
                            </span>
                            <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                              ({log.x - 5 >= 0 ? `+${log.x - 4}` : log.x - 5}, {log.y - 5 >= 0 ? `+${log.y - 4}` : log.y - 5})
                            </span>
                          </div>

                          {log.note && (
                            <p className="text-slate-600 text-xs italic leading-relaxed break-words pr-2">
                              "{log.note}"
                            </p>
                          )}

                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <span>{log.timestamp}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="absolute right-3 top-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

          </div>

        </div>
        </>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3 sm:px-6 lg:px-8">
          <p className="text-xs text-slate-400 font-medium animate-pulse">
            Based on the Yale Center for Emotional Intelligence "Mood Meter" model. RULER approach.
          </p>
          <p className="text-[11px] text-slate-400">
            Made with ❤️ for emotional self-awareness | 2026
          </p>
        </div>
      </footer>
    </div>
  );
}