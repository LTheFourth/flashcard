// Flashcard App with Tinder-like Swipe Interface and Offline Support
class FlashcardApp {
    constructor() {
        this.flashcardData = {
            hsk3: [
                { "chinese": "安静", "pinyin": "ānjìng", "vietnamese": "yên tĩnh, trầm lặng", "example": "请安静，图书馆里不准大声说话。", "example_vi": "Xin hãy yên lặng, trong thư viện không được phép nói chuyện lớn tiếng." },
                { "chinese": "把", "pinyin": "bǎ", "vietnamese": "dùng để đưa tân ngữ lên trước động từ", "example": "请把这本书给我。", "example_vi": "Làm ơn đưa cuốn sách này cho tôi." },
                { "chinese": "班", "pinyin": "bān", "vietnamese": "lớp học, ca làm", "example": "我们班有二十个学生。", "example_vi": "Lớp chúng tôi có hai mươi học sinh." },
                { "chinese": "搬", "pinyin": "bān", "vietnamese": "dọn, chuyển (đồ, nhà)", "example": "我下个星期要搬家。", "example_vi": "Tuần tới tôi phải chuyển nhà." },
                { "chinese": "办法", "pinyin": "bànfǎ", "vietnamese": "cách, biện pháp", "example": "你有什么好办法吗？", "example_vi": "Bạn có cách nào hay không?" },
                { "chinese": "办公室", "pinyin": "bàngōngshì", "vietnamese": "văn phòng", "example": "经理在办公室里等你。", "example_vi": "Giám đốc đang đợi bạn trong văn phòng." },
                { "chinese": "半", "pinyin": "bàn", "vietnamese": "nửa", "example": "现在是三点半。", "example_vi": "Bây giờ là ba giờ rưỡi." },
                { "chinese": "帮忙", "pinyin": "bāngmáng", "vietnamese": "giúp, giúp đỡ", "example": "你能帮我一个忙吗？", "example_vi": "Bạn có thể giúp tôi một việc được không?" },
                { "chinese": "包", "pinyin": "bāo", "vietnamese": "túi, bao", "example": "我的包是黑色的。", "example_vi": "Túi của tôi màu đen." },
                { "chinese": "饱", "pinyin": "bǎo", "vietnamese": "no, đầy bụng", "example": "我吃饱了，谢谢。", "example_vi": "Tôi no rồi, cảm ơn." },
                { "chinese": "北方", "pinyin": "běifāng", "vietnamese": "miền Bắc", "example": "北方的冬天很冷。", "example_vi": "Mùa đông ở miền Bắc rất lạnh." },
                { "chinese": "被", "pinyin": "bèi", "vietnamese": "bị (dùng trong câu bị động)", "example": "我的钱包被偷了。", "example_vi": "Ví tiền của tôi đã bị trộm mất." },
                { "chinese": "鼻子", "pinyin": "bízi", "vietnamese": "mũi", "example": "他的鼻子很高。", "example_vi": "Mũi của anh ấy rất cao." },
                { "chinese": "比较", "pinyin": "bǐjiào", "vietnamese": "khá, tương đối", "example": "今天的天气比较好。", "example_vi": "Thời tiết hôm nay khá tốt." },
                { "chinese": "比赛", "pinyin": "bǐsài", "vietnamese": "thi đấu, cuộc thi", "example": "你看了昨天的足球比赛吗？", "example_vi": "Bạn đã xem trận đấu bóng đá ngày hôm qua chưa?" },
                { "chinese": "笔记本", "pinyin": "bǐjìběn", "vietnamese": "sổ ghi chép, laptop", "example": "我忘带笔记本了。", "example_vi": "Tôi quên mang sổ tay rồi." },
                { "chinese": "必须", "pinyin": "bìxū", "vietnamese": "phải, bắt buộc", "example": "你必须按时完成作业。", "example_vi": "Bạn phải hoàn thành bài tập đúng giờ." },
                { "chinese": "变化", "pinyin": "biànhuà", "vietnamese": "thay đổi", "example": "这个城市的变化很大。", "example_vi": "Sự thay đổi của thành phố này rất lớn." },
                { "chinese": "别人", "pinyin": "biéren", "vietnamese": "người khác", "example": "不要在背后说别人的坏话。", "example_vi": "Đừng nói xấu người khác sau lưng." },
                { "chinese": "冰箱", "pinyin": "bīngxiāng", "vietnamese": "tủ lạnh", "example": "冰箱里还有牛奶吗？", "example_vi": "Trong tủ lạnh còn sữa không?" },
                { "chinese": "不但...而且...", "pinyin": "bùdàn... érqiě...", "vietnamese": "không những... mà còn...", "example": "他不但会说英语，而且还会说法语。", "example_vi": "Anh ấy không những biết nói tiếng Anh mà còn biết nói tiếng Pháp." },
                { "chinese": "菜单", "pinyin": "càidān", "vietnamese": "thực đơn", "example": "服务员，请给我菜单。", "example_vi": "Phục vụ, cho tôi xin thực đơn." },
                { "chinese": "参加", "pinyin": "cānjiā", "vietnamese": "tham gia", "example": "我想参加这个活动。", "example_vi": "Tôi muốn tham gia hoạt động này." },
                { "chinese": "草", "pinyin": "cǎo", "vietnamese": "cỏ", "example": "公园里有很多绿色的草。", "example_vi": "Trong công viên có rất nhiều cỏ xanh." },
                { "chinese": "层", "pinyin": "céng", "vietnamese": "tầng (nhà)", "example": "我住在三层。", "example_vi": "Tôi sống ở tầng ba." },
                { "chinese": "差", "pinyin": "chà", "vietnamese": "thiếu, kém", "example": "我的数学成绩很差。", "example_vi": "Thành tích môn toán của tôi rất kém." },
                { "chinese": "超市", "pinyin": "chāoshì", "vietnamese": "siêu thị", "example": "我们去超市买点东西吧。", "example_vi": "Chúng ta đi siêu thị mua chút đồ đi." },
                { "chinese": "衬衫", "pinyin": "chènshān", "vietnamese": "áo sơ mi", "example": "他今天穿了一件白衬衫。", "example_vi": "Hôm nay anh ấy mặc một chiếc áo sơ mi trắng." },
                { "chinese": "成绩", "pinyin": "chéngjì", "vietnamese": "thành tích, kết quả", "example": "这次考试我的成绩很好。", "example_vi": "Kết quả bài kiểm tra lần này của tôi rất tốt." },
                { "chinese": "城市", "pinyin": "chéngshì", "vietnamese": "thành phố", "example": "北京是一个大城市。", "example_vi": "Bắc Kinh là một thành phố lớn." },
                { "chinese": "迟到", "pinyin": "chídào", "vietnamese": "đến muộn", "example": "对不起，我今天迟到了。", "example_vi": "Xin lỗi, hôm nay tôi đến muộn." },
                { "chinese": "出现", "pinyin": "chūxiàn", "vietnamese": "xuất hiện", "example": "问题终于出现了。", "example_vi": "Vấn đề cuối cùng cũng đã xuất hiện." },
                { "chinese": "厨房", "pinyin": "chúfáng", "vietnamese": "nhà bếp", "example": "妈妈正在厨房做饭。", "example_vi": "Mẹ đang nấu ăn trong bếp." },
                { "chinese": "除了", "pinyin": "chúle", "vietnamese": "ngoài ra, trừ", "example": "除了苹果，别的我都不喜欢吃。", "example_vi": "Ngoài táo ra, tôi không thích ăn thứ gì khác." },
                { "chinese": "春", "pinyin": "chūn", "vietnamese": "mùa xuân", "example": "春天来了，花都开了。", "example_vi": "Mùa xuân đến rồi, hoa đã nở." },
                { "chinese": "词语", "pinyin": "cíyǔ", "vietnamese": "từ vựng", "example": "这个词语是什么意思？", "example_vi": "Từ này có nghĩa là gì?" },
                { "chinese": "聪明", "pinyin": "cōngming", "vietnamese": "thông minh", "example": "他是一个非常聪明的孩子。", "example_vi": "Cậu bé ấy là một đứa trẻ rất thông minh." },
                { "chinese": "打扫", "pinyin": "dǎsǎo", "vietnamese": "quét dọn", "example": "我每个周末都打扫房间。", "example_vi": "Tôi dọn dẹp phòng mỗi cuối tuần." },
                { "chinese": "打算", "pinyin": "dǎsuàn", "vietnamese": "dự định", "example": "你明天有什么打算？", "example_vi": "Ngày mai bạn có dự định gì không?" },
                { "chinese": "带", "pinyin": "dài", "vietnamese": "mang theo", "example": "出门别忘了带伞。", "example_vi": "Ra ngoài đừng quên mang ô." },
                { "chinese": "担心", "pinyin": "dānxīn", "vietnamese": "lo lắng", "example": "别担心，一切都会好的。", "example_vi": "Đừng lo lắng, mọi chuyện rồi sẽ ổn thôi." },
                { "chinese": "蛋糕", "pinyin": "dàngāo", "vietnamese": "bánh ngọt", "example": "生日快乐！这是你的蛋糕。", "example_vi": "Chúc mừng sinh nhật! Đây là bánh của bạn." },
                { "chinese": "当然", "pinyin": "dāngrán", "vietnamese": "dĩ nhiên", "example": "你当然可以来参加我的派对。", "example_vi": "Tất nhiên bạn có thể đến tham dự bữa tiệc của tôi." },
                { "chinese": "灯", "pinyin": "dēng", "vietnamese": "đèn", "example": "请把灯打开。", "example_vi": "Làm ơn bật đèn lên." },
                { "chinese": "低", "pinyin": "dī", "vietnamese": "thấp", "example": "这个桌子太低了。", "example_vi": "Cái bàn này thấp quá." },
                { "chinese": "地铁", "pinyin": "dìtiě", "vietnamese": "tàu điện ngầm", "example": "我每天坐地铁上班。", "example_vi": "Tôi đi làm bằng tàu điện ngầm mỗi ngày." },
                { "chinese": "地图", "pinyin": "dìtú", "vietnamese": "bản đồ", "example": "你看一下地图，我们现在在哪里？", "example_vi": "Bạn xem bản đồ một chút, chúng ta đang ở đâu?" },
                { "chinese": "电梯", "pinyin": "diàntī", "vietnamese": "thang máy", "example": "我们坐电梯上去吧。", "example_vi": "Chúng ta đi thang máy lên đi." },
            ],
            hsk4: [
                {
                    "chinese": "兵",
                    "pinyin": "bīng",
                    "vietnamese": "lính, quân lính (cũng dùng trước từ phủ định để nhấn mạnh)",
                    "example": "他当了三年兵。",
                    "example_vi": "Anh ấy đã đi lính ba năm."
                },
                {
                    "chinese": "俩",
                    "pinyin": "liǎ",
                    "vietnamese": "hai (chỉ số lượng, thường dùng trong khẩu ngữ)",
                    "example": "我们俩是好朋友。",
                    "example_vi": "Hai chúng tôi là bạn tốt."
                },
                {
                    "chinese": "精神",
                    "pinyin": "jīngshén",
                    "vietnamese": "tinh thần",
                    "example": "他今天看起来精神很好。",
                    "example_vi": "Hôm nay trông anh ấy tinh thần rất tốt."
                },
                {
                    "chinese": "力量",
                    "pinyin": "lìliang",
                    "vietnamese": "sức, sức lực",
                    "example": "团队的力量是无穷的。",
                    "example_vi": "Sức mạnh của tập thể là vô hạn."
                },
                {
                    "chinese": "厉害",
                    "pinyin": "lìhai",
                    "vietnamese": "lợi hại, ghê gớm",
                    "example": "你的中文说得真厉害！",
                    "example_vi": "Tiếng Trung của bạn nói thật lợi hại!"
                },
                {
                    "chinese": "连",
                    "pinyin": "lián",
                    "vietnamese": "ngay cả",
                    "example": "他忙得连饭都没时间吃。",
                    "example_vi": "Anh ấy bận đến mức ngay cả ăn cơm cũng không có thời gian."
                },
                {
                    "chinese": "联系",
                    "pinyin": "liánxì",
                    "vietnamese": "liên hệ",
                    "example": "我们以后要多联系。",
                    "example_vi": "Sau này chúng ta phải liên lạc nhiều hơn."
                },
                {
                    "chinese": "凉快",
                    "pinyin": "liángkuai",
                    "vietnamese": "mát mẻ",
                    "example": "下雨以后，天气凉快多了。",
                    "example_vi": "Sau khi mưa, thời tiết mát mẻ hơn nhiều."
                },
                {
                    "chinese": "临时",
                    "pinyin": "línshí",
                    "vietnamese": "tạm thời, lâm thời",
                    "example": "这是一个临时的决定。",
                    "example_vi": "Đây là một quyết định tạm thời."
                },
                {
                    "chinese": "梦",
                    "pinyin": "mèng",
                    "vietnamese": "giấc mơ",
                    "example": "我昨天做了一个奇怪的梦。",
                    "example_vi": "Hôm qua tôi có một giấc mơ kỳ lạ."
                },
                {
                    "chinese": "面前",
                    "pinyin": "miànqián",
                    "vietnamese": "trước mặt",
                    "example": "不要在孩子面前吵架。",
                    "example_vi": "Đừng cãi nhau trước mặt con trẻ."
                },
                {
                    "chinese": "醒",
                    "pinyin": "xǐng",
                    "vietnamese": "tỉnh (ngủ)",
                    "example": "你一般早上几点醒？",
                    "example_vi": "Bạn thường tỉnh dậy lúc mấy giờ sáng?"
                },
                {
                    "chinese": "信封",
                    "pinyin": "xìnfēng",
                    "vietnamese": "phong bì, bì thư",
                    "example": "我需要一个信封来寄这封信。",
                    "example_vi": "Tôi cần một cái phong bì để gửi lá thư này."
                },
                {
                    "chinese": "修理",
                    "pinyin": "xiūlǐ",
                    "vietnamese": "sửa chữa",
                    "example": "我的自行车坏了，需要修理一下。",
                    "example_vi": "Xe đạp của tôi bị hỏng, cần phải sửa chữa một chút."
                },
                {
                    "chinese": "咸",
                    "pinyin": "xián",
                    "vietnamese": "mặn",
                    "example": "这个菜有点咸。",
                    "example_vi": "Món này hơi mặn."
                },
                {
                    "chinese": "响",
                    "pinyin": "xiǎng",
                    "vietnamese": "kêu, vang",
                    "example": "你的手机响了。",
                    "example_vi": "Điện thoại của bạn reo kìa."
                },
                {
                    "chinese": "相反",
                    "pinyin": "xiāngfǎn",
                    "vietnamese": "tương phản, trái lại",
                    "example": "他说他很忙，但相反，他很闲。",
                    "example_vi": "Anh ấy nói anh ấy rất bận, nhưng trái lại, anh ấy rất rảnh."
                },
                {
                    "chinese": "消息",
                    "pinyin": "xiāoxi",
                    "vietnamese": "tin tức",
                    "example": "你听到那个好消息了吗？",
                    "example_vi": "Bạn đã nghe được tin tốt đó chưa?"
                },
                {
                    "chinese": "小偷",
                    "pinyin": "xiǎotōu",
                    "vietnamese": "kẻ trộm",
                    "example": "他抓到了那个小偷。",
                    "example_vi": "Anh ấy đã bắt được tên trộm đó."
                },
                {
                    "chinese": "尊重",
                    "pinyin": "zūnzhòng",
                    "vietnamese": "tôn trọng",
                    "example": "我们应该互相尊重。",
                    "example_vi": "Chúng ta nên tôn trọng lẫn nhau."
                },
                {
                    "chinese": "按",
                    "pinyin": "àn",
                    "vietnamese": "theo, dựa vào",
                    "example": "请按时完成工作。",
                    "example_vi": "Xin hãy hoàn thành công việc theo đúng thời hạn."
                },
                {
                    "chinese": "报告",
                    "pinyin": "bàogào",
                    "vietnamese": "báo cáo",
                    "example": "他正在写一份工作报告。",
                    "example_vi": "Anh ấy đang viết một bản báo cáo công việc."
                },
                {
                    "chinese": "差不多",
                    "pinyin": "chàbuduō",
                    "vietnamese": "khoảng, xấp xỉ, cũng gần như",
                    "example": "他们俩的个子差不多高。",
                    "example_vi": "Vóc dáng của hai người họ cao xấp xỉ nhau."
                },
                {
                    "chinese": "尝",
                    "pinyin": "cháng",
                    "vietnamese": "nếm",
                    "example": "你尝尝这个菜，味道很好。",
                    "example_vi": "Bạn nếm thử món này đi, vị rất ngon."
                },
                {
                    "chinese": "重新",
                    "pinyin": "chóngxīn",
                    "vietnamese": "làm lại, một lần nữa",
                    "example": "这个问题我们需要重新考虑。",
                    "example_vi": "Vấn đề này chúng ta cần xem xét lại."
                },
                {
                    "chinese": "答案",
                    "pinyin": "dá’àn",
                    "vietnamese": "đáp án",
                    "example": "你知道这道题的答案吗？",
                    "example_vi": "Bạn có biết đáp án của câu hỏi này không?"
                },
                {
                    "chinese": "打扰",
                    "pinyin": "dǎrǎo",
                    "vietnamese": "làm phiền",
                    "example": "对不起，打扰一下，请问洗手间在哪里？",
                    "example_vi": "Xin lỗi, làm phiền một chút, cho hỏi nhà vệ sinh ở đâu?"
                },
                {
                    "chinese": "地址",
                    "pinyin": "dìzhǐ",
                    "vietnamese": "địa chỉ",
                    "example": "请把你的地址写给我。",
                    "example_vi": "Xin hãy viết địa chỉ của bạn cho tôi."
                },
                {
                    "chinese": "动作",
                    "pinyin": "dòngzuò",
                    "vietnamese": "động tác",
                    "example": "他的舞蹈动作很优美。",
                    "example_vi": "Động tác múa của cô ấy rất uyển chuyển."
                },
                {
                    "chinese": "堵车",
                    "pinyin": "dǔchē",
                    "vietnamese": "tắc đường, kẹt xe",
                    "example": "我上班迟到了，因为路上堵车很严重。",
                    "example_vi": "Tôi đi làm muộn vì trên đường kẹt xe nghiêm trọng."
                },
                {
                    "chinese": "翻译",
                    "pinyin": "fānyì",
                    "vietnamese": "phiên dịch",
                    "example": "你能帮我翻译这段话吗？",
                    "example_vi": "Bạn có thể giúp tôi phiên dịch đoạn này không?"
                },
                {
                    "chinese": "反对",
                    "pinyin": "fǎnduì",
                    "vietnamese": "phản đối",
                    "example": "我反对这个计划。",
                    "example_vi": "Tôi phản đối kế hoạch này."
                },
                {
                    "chinese": "法律",
                    "pinyin": "fǎlǜ",
                    "vietnamese": "pháp luật",
                    "example": "每个人都应该遵守法律。",
                    "example_vi": "Mọi người đều nên tuân thủ pháp luật."
                },
                {
                    "chinese": "公里",
                    "pinyin": "gōnglǐ",
                    "vietnamese": "ki-lô-mét (km)",
                    "example": "我家离公司有五公里远。",
                    "example_vi": "Nhà tôi cách công ty 5 km."
                },
                {
                    "chinese": "工资",
                    "pinyin": "gōngzī",
                    "vietnamese": "lương",
                    "example": "这个月你的工资发了吗？",
                    "example_vi": "Tháng này bạn đã nhận lương chưa?"
                },
                {
                    "chinese": "逛",
                    "pinyin": "guàng",
                    "vietnamese": "dạo",
                    "example": "我们晚上去逛街吧。",
                    "example_vi": "Buổi tối chúng ta đi dạo phố đi."
                },
                {
                    "chinese": "广告",
                    "pinyin": "guǎnggào",
                    "vietnamese": "quảng cáo",
                    "example": "我不喜欢看电视广告。",
                    "example_vi": "Tôi không thích xem quảng cáo trên TV."
                },
                {
                    "chinese": "国际",
                    "pinyin": "guójì",
                    "vietnamese": "quốc tế",
                    "example": "这是一个国际会议。",
                    "example_vi": "Đây là một hội nghị quốc tế."
                },
                {
                    "chinese": "果汁",
                    "pinyin": "guǒzhī",
                    "vietnamese": "nước trái cây",
                    "example": "我早上喜欢喝一杯果汁。",
                    "example_vi": "Buổi sáng tôi thích uống một ly nước trái cây."
                },
                {
                    "chinese": "合适",
                    "pinyin": "héshì",
                    "vietnamese": "thích hợp",
                    "example": "这件衣服你穿很合适。",
                    "example_vi": "Bộ quần áo này bạn mặc rất hợp."
                }
            ] // Placeholder for future HSK4 cards
        };

        // App state
        this.currentHSKLevel = 'hsk3';
        this.currentFlashcards = [];
        this.cardQueue = [];
        this.currentIndex = 0;
        this.isChineseFirst = true;
        this.cardFrequencies = {};
        this.cardsLearned = 0;
        this.sessionCards = [];

        // Swipe state
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.cardBeingDragged = null;

        // DOM elements
        this.cardStack = document.getElementById('cardStack');
        this.splashScreen = document.getElementById('splash-screen');
        this.noMoreCards = document.getElementById('noMoreCards');
        this.progressFill = document.getElementById('progressFill');
        this.cardsLearnedEl = document.getElementById('cards-learned');

        this.init();
    }

    init() {
        this.loadFlashcards();
        this.setupEventListeners();
        this.renderCardStack();
        this.updateStats();
    }

    loadFlashcards() {
        console.log('loadFlashcards called for level:', this.currentHSKLevel);
        console.log('Available data keys:', Object.keys(this.flashcardData));
        console.log('HSK4 data exists:', !!this.flashcardData.hsk4);
        
        this.currentFlashcards = [...this.flashcardData[this.currentHSKLevel]];
        console.log(this.currentFlashcards)
        
        console.log('Loaded flashcards:', this.currentFlashcards.length, 'cards');
        console.log('Sample card:', this.currentFlashcards[0]);
        
        this.initializeCardFrequencies();
        this.shuffleCards();
        this.sessionCards = [...this.currentFlashcards];
        
        console.log('Session cards set:', this.sessionCards.length, 'cards');
    }

    initializeCardFrequencies() {
        this.cardFrequencies = {};
        this.currentFlashcards.forEach((card, index) => {
            this.cardFrequencies[index] = 1;
        });
    }

    shuffleCards() {
        this.cardQueue = this.getWeightedRandomCards();
        this.currentIndex = 0;
    }

    getWeightedRandomCards() {
        const cards = [...this.currentFlashcards];
        const weights = Object.values(this.cardFrequencies);

        // Fisher-Yates shuffle with weights
        for (let i = cards.length - 1; i > 0; i--) {
            const j = this.getWeightedRandomIndex(weights);
            [cards[i], cards[j]] = [cards[j], cards[i]];
            [weights[i], weights[j]] = [weights[j], weights[i]];
        }

        return cards;
    }

    getWeightedRandomIndex(weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return i;
            }
        }

        return weights.length - 1;
    }

    renderCardStack() {
        this.cardStack.innerHTML = '';
        const cardsToShow = Math.min(5, this.cardQueue.length - this.currentIndex);

        for (let i = 0; i < cardsToShow; i++) {
            const card = this.cardQueue[this.currentIndex + i];
            const cardEl = this.createCardElement(card, i === 0);
            this.cardStack.appendChild(cardEl);
        }

        if (cardsToShow === 0) {
            this.showNoMoreCards();
        }
    }

    createCardElement(card, isTopCard) {
        const cardEl = document.createElement('div');
        cardEl.className = 'flashcard';
        if (isTopCard) {
            cardEl.classList.add('top-card');
        }

        const frontContent = this.isChineseFirst ? card.chinese : card.vietnamese;
        const backContent = this.getCardBackContent(card);

        cardEl.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front">
                    <div class="card-chinese">${this.isChineseFirst ? card.chinese : card.vietnamese}</div>
                    ${this.isChineseFirst ? '' : `<div class="card-pinyin">${card.pinyin}</div>`}
                </div>
                <div class="card-face card-back">
                    ${backContent}
                </div>
            </div>
        `;

        if (isTopCard) {
            this.setupCardInteractions(cardEl, card);
        }

        return cardEl;
    }

    getCardBackContent(card) {
        if (this.isChineseFirst) {
            return `
                <div class="card-vietnamese">${card.vietnamese}</div>
                <div class="card-pinyin">${card.pinyin}</div>
                <div class="card-example">
                    <div class="example-label">Ví dụ</div>
                    <div class="example-text">${card.example}</div>
                    <div class="example-vi">${card.example_vi}</div>
                </div>
            `;
        } else {
            return `
                <div class="card-chinese">${card.chinese}</div>
                <div class="card-pinyin">${card.pinyin}</div>
                <div class="card-example">
                    <div class="example-label">Ví dụ</div>
                    <div class="example-text">${card.example}</div>
                    <div class="example-vi">${card.example_vi}</div>
                </div>
            `;
        }
    }

    setupCardInteractions(cardEl, card) {
        // Touch events for mobile
        cardEl.addEventListener('touchstart', (e) => this.handleTouchStart(e, cardEl), { passive: true });
        cardEl.addEventListener('touchmove', (e) => this.handleTouchMove(e, cardEl), { passive: true });
        cardEl.addEventListener('touchend', (e) => this.handleTouchEnd(e, cardEl));

        // Mouse events for desktop
        cardEl.addEventListener('mousedown', (e) => this.handleMouseDown(e, cardEl));
        cardEl.addEventListener('mousemove', (e) => this.handleMouseMove(e, cardEl));
        cardEl.addEventListener('mouseup', (e) => this.handleMouseUp(e, cardEl));
        cardEl.addEventListener('mouseleave', (e) => this.handleMouseUp(e, cardEl));

        // Click to flip
        cardEl.addEventListener('click', (e) => {
            if (!this.isDragging) {
                this.flipCard(cardEl);
            }
        });
    }

    handleTouchStart(e, cardEl) {
        this.startDrag(e.touches[0].clientX, cardEl);
    }

    handleTouchMove(e, cardEl) {
        if (this.isDragging) {
            e.preventDefault();
            this.drag(e.touches[0].clientX, cardEl);
        }
    }

    handleTouchEnd(e, cardEl) {
        this.endDrag(cardEl);
    }

    handleMouseDown(e, cardEl) {
        e.preventDefault();
        this.startDrag(e.clientX, cardEl);
    }

    handleMouseMove(e, cardEl) {
        if (this.isDragging) {
            this.drag(e.clientX, cardEl);
        }
    }

    handleMouseUp(e, cardEl) {
        this.endDrag(cardEl);
    }

    startDrag(x, cardEl) {
        this.isDragging = true;
        this.startX = x;
        this.currentX = x;
        this.cardBeingDragged = cardEl;
        cardEl.classList.add('dragging');
        cardEl.style.transition = 'none';
    }

    drag(x, cardEl) {
        if (!this.isDragging) return;

        this.currentX = x;
        const deltaX = x - this.startX;
        const rotation = deltaX / 15;

        cardEl.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;

        // Add visual feedback based on swipe direction
        if (deltaX < -50) {
            cardEl.style.borderColor = '#fbbf24';
            cardEl.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.5)';
        } else if (deltaX > 50) {
            cardEl.style.borderColor = '#34d399';
            cardEl.style.boxShadow = '0 0 20px rgba(52, 211, 153, 0.5)';
        } else {
            cardEl.style.borderColor = '';
            cardEl.style.boxShadow = '';
        }
    }

    endDrag(cardEl) {
        if (!this.isDragging) return;

        this.isDragging = false;
        cardEl.classList.remove('dragging');
        cardEl.style.transition = '';

        const deltaX = this.currentX - this.startX;
        const threshold = 100;

        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                this.swipeCard('right', cardEl);
            } else {
                this.swipeCard('left', cardEl);
            }
        } else {
            // Reset card position
            cardEl.style.transform = '';
            cardEl.style.borderColor = '';
            cardEl.style.boxShadow = '';
        }

        this.cardBeingDragged = null;
    }

    swipeCard(direction, cardEl) {
        const isRemembered = direction === 'right';

        // Animate card off screen
        if (direction === 'right') {
            cardEl.classList.add('swipe-right');
        } else {
            cardEl.classList.add('swipe-left');
        }

        // Update frequency and stats
        this.updateCardFrequency(isRemembered);
        this.cardsLearned++;
        this.updateStats();

        // Show splash screen
        this.showSplashScreen(isRemembered ? 'remembered' : 'recall');

        // Remove card and show next
        setTimeout(() => {
            this.currentIndex++;
            this.renderCardStack();
            this.updateProgress();
        }, 300);
    }

    flipCard(cardEl) {
        cardEl.classList.toggle('flipped');
    }

    updateCardFrequency(isRemembered) {
        const originalIndex = this.currentFlashcards.indexOf(this.cardQueue[this.currentIndex]);
        if (originalIndex !== -1) {
            if (isRemembered) {
                this.cardFrequencies[originalIndex] = Math.max(this.cardFrequencies[originalIndex] * 0.7, 0.1);
            } else {
                this.cardFrequencies[originalIndex] = Math.min(this.cardFrequencies[originalIndex] * 1.5, 5);
            }
        }
    }

    showSplashScreen(type) {
        this.splashScreen.className = `splash-screen show ${type}`;
        const icon = this.splashScreen.querySelector('.splash-icon');
        const text = this.splashScreen.querySelector('.splash-text');

        if (type === 'recall') {
            icon.textContent = '🔄';
            text.textContent = 'Recall';
        } else if (type === 'remembered') {
            icon.textContent = '✓';
            text.textContent = 'Remembered!';
        }

        setTimeout(() => {
            this.splashScreen.classList.remove('show');
        }, 1000);
    }

    showNoMoreCards() {
        this.noMoreCards.style.display = 'flex';
    }

    hideNoMoreCards() {
        try {
            this.noMoreCards.style.display = 'none';
        } catch (error) {
            console.info('Error hiding no more cards:', error);            
        }
    }

    updateStats() {
        this.cardsLearnedEl.textContent = this.cardsLearned;
    }

    updateProgress() {
        const progress = (this.currentIndex / this.sessionCards.length) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    changeHSKLevel(level) {
        console.log('Changing HSK level to:', level);
        console.log('Current level before change:', this.currentHSKLevel);
        console.log('Available HSK4 cards count:', this.flashcardData.hsk4 ? this.flashcardData.hsk4.length : 0);
        
        // Show visual notification
        this.showNotification(`Switching to ${level.toUpperCase()}...`, 'info');

        this.currentHSKLevel = level;
        this.cardsLearned = 0;
        this.currentIndex = 0;

        console.log('Level set to:', this.currentHSKLevel);

        // Hide no more cards screen if visible
        this.hideNoMoreCards();

        // Load new flashcards for the selected level
        this.loadFlashcards();
        
        console.log('After loadFlashcards - current cards count:', this.currentFlashcards.length);
        console.log('First card after level change:', this.currentFlashcards[0]);

        // Initialize frequencies for new cards
        this.initializeCardFrequencies();

        // Shuffle the new cards
        this.shuffleCards();

        // Render the new card stack
        this.renderCardStack();

        // Update UI statistics
        this.updateStats();
       
        console.log('HSK level changed successfully to', level, 'with', this.currentFlashcards.length, 'cards');
        
        // Show success notification with card count
    }

    toggleLanguageMode() {
        this.isChineseFirst = !this.isChineseFirst;
        console.log('Language mode toggled to:', this.isChineseFirst ? 'Chinese First' : 'Vietnamese First');
        this.renderCardStack();
    }

    handleRecall() {
        const topCard = this.cardStack.querySelector('.flashcard.top-card');
        if (topCard) {
            this.swipeCard('left', topCard);
        }
    }

    handleRemembered() {
        const topCard = this.cardStack.querySelector('.flashcard.top-card');
        if (topCard) {
            this.swipeCard('right', topCard);
        }
    }

    handleFlip() {
        const topCard = this.cardStack.querySelector('.flashcard.top-card');
        if (topCard) {
            this.flipCard(topCard);
        }
    }

    restart() {
        this.cardsLearned = 0;
        this.hideNoMoreCards();
        this.shuffleCards();
        this.renderCardStack();
        this.updateStats();
        this.updateProgress();
    }

    setupEventListeners() {
        // Listen for React settings changes
        window.addEventListener('settingsChanged', (e) => {
            const { hskLevel, isChineseFirst } = e.detail;

            console.log('=== SETTINGS CHANGED EVENT ===');
            console.log('Received settings change:', { hskLevel, isChineseFirst });
            console.log('Current FlashcardApp level:', this.currentHSKLevel);
            console.log('Should change level?', hskLevel !== this.currentHSKLevel);

            // Update HSK level if changed
            if (hskLevel !== this.currentHSKLevel) {
                console.log('Calling changeHSKLevel with:', hskLevel);
                this.changeHSKLevel(hskLevel);
            } else {
                console.log('Level unchanged, skipping changeHSKLevel');
            }

            // Update language mode if changed
            if (isChineseFirst !== this.isChineseFirst) {
                this.isChineseFirst = isChineseFirst;
                this.renderCardStack();
            }
        });

        // Listen for reset progress event
        window.addEventListener('resetProgress', () => {
            console.log('Resetting progress...');
            this.restart();
        });

        // Listen for show progress event
        window.addEventListener('showProgress', () => {
            const totalCards = this.sessionCards.length;
            const learnedCards = this.cardsLearned;
            const progressPercentage = totalCards > 0 ? Math.round((learnedCards / totalCards) * 100) : 0;

            alert(`📊 Learning Progress\n\n📚 Total Cards: ${totalCards}\n✅ Cards Learned: ${learnedCards}\n📈 Progress: ${progressPercentage}%\n🎯 Current Level: ${this.currentHSKLevel.toUpperCase()}\n🌐 Language: ${this.isChineseFirst ? 'Chinese First' : 'Vietnamese First'}`);
        });

        // Action buttons
        document.getElementById('recall-button').addEventListener('click', () => {
            this.handleRecall();
        });

        document.getElementById('remembered-button').addEventListener('click', () => {
            this.handleRemembered();
        });

        document.getElementById('flip-button').addEventListener('click', () => {
            this.handleFlip();
        });

        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });

        // Prevent context menu on cards
        this.cardStack.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Listen for sync events from service worker
        window.addEventListener('syncProgress', () => {
            this.syncProgressData();
        });

        window.addEventListener('syncData', () => {
            this.syncAllData();
        });
    }

    // Offline data fetching and sync methods
    async fetchOfflineData() {
        try {
            // Try to get data from service worker cache first
            const response = await fetch('/flashcard/data/hsk3.json');
            if (response.ok) {
                const data = await response.json();
                this.flashcardData.hsk3 = data;
                console.log('Loaded flashcard data from service worker cache');
                return true;
            }
        } catch (error) {
            console.log('Could not fetch from service worker, using embedded data');
        }
        return false;
    }

    async syncProgressData() {
        if (!navigator.onLine) return;

        try {
            // Get current progress from localStorage
            const progressKey = `flashcard_progress_${this.currentHSKLevel}`;
            const progressData = localStorage.getItem(progressKey);

            if (progressData) {
                const progress = JSON.parse(progressData);
                console.log('Syncing progress data:', progress);

                // Here you could sync with a backend server
                // For now, we'll just ensure it's stored locally
                localStorage.setItem(progressKey, JSON.stringify(progress));

                // Show sync notification
                this.showNotification('Progress synced successfully', 'success');
            }
        } catch (error) {
            console.error('Failed to sync progress data:', error);
            this.showNotification('Failed to sync progress', 'error');
        }
    }

    async syncAllData() {
        if (!navigator.onLine) return;

        try {
            // Sync progress data
            await this.syncProgressData();

            // Try to fetch updated flashcard data
            const fetched = await this.fetchOfflineData();
            if (fetched) {
                this.showNotification('Flashcard data updated', 'success');
            }
        } catch (error) {
            console.error('Failed to sync all data:', error);
            this.showNotification('Sync failed, using offline data', 'warning');
        }
    }

    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Enhanced saveProgress method with sync capability
    saveProgress() {
        const progressKey = `flashcard_progress_${this.currentHSKLevel}`;
        const progress = {
            hskLevel: this.currentHSKLevel,
            cardsLearned: this.cardsLearned,
            sessionCards: this.sessionCards,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(progressKey, JSON.stringify(progress));

        // Try to sync if online
        if (navigator.onLine) {
            this.syncProgressData();
        }
    }

    // Enhanced loadProgress method
    loadProgress() {
        const progressKey = `flashcard_progress_${this.currentHSKLevel}`;
        const savedProgress = localStorage.getItem(progressKey);

        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                this.cardsLearned = progress.cardsLearned || 0;
                this.sessionCards = progress.sessionCards || [...this.flashcardData[this.currentHSKLevel]];
                console.log('Loaded progress from localStorage:', progress);
            } catch (error) {
                console.error('Failed to load progress:', error);
                this.sessionCards = [...this.flashcardData[this.currentHSKLevel]];
            }
        } else {
            this.sessionCards = [...this.flashcardData[this.currentHSKLevel]];
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
});