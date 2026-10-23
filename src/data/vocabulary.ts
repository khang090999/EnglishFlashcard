import type { Deck, Level } from '../lib/types';
export const levelNames: Record<Level, string> = {
	A1: 'Beginner',
	A2: 'Elementary',
	B1: 'Intermediate',
	B2: 'Upper intermediate',
	C1: 'Advanced',
	C2: 'Proficient',
};
const makeDeck = (
	id: string,
	title: string,
	description: string,
	level: Level,
	topic: string,
	color: string,
	icon: string,
	entries: string
): Deck => ({
	id,
	title,
	description,
	level,
	topic,
	color,
	icon,
	words: entries
		.trim()
		.split('\n')
		.map((row, index) => {
			const [english, phonetic, vietnamese, example] = row.split('|');
			return { id: `${id}-${index}`, english, phonetic, vietnamese, example };
		}),
});
export const starterDecks: Deck[] = [
	makeDeck(
		'everyday',
		'Everyday essentials',
		'Little words. A world of possibilities.',
		'A1',
		'Daily life',
		'peach',
		'sun',
		`
hello|/həˈləʊ/|xin chào|Hello! It is nice to meet you.
family|/ˈfæm.əl.i/|gia đình|My family lives in Hanoi.
friend|/frend/|bạn bè|She is my best friend.
home|/həʊm/|nhà|I walk home after school.
water|/ˈwɔː.tə/|nước|I drink water every morning.
happy|/ˈhæp.i/|vui vẻ; hạnh phúc|I am happy to see you.
learn|/lɜːn/|học|We learn English together.
morning|/ˈmɔː.nɪŋ/|buổi sáng|Good morning, everyone!
book|/bʊk/|quyển sách|This book is interesting.
beautiful|/ˈbjuː.tɪ.fəl/|đẹp|What a beautiful day!`
	),
	makeDeck(
		'food',
		'Food & little cravings',
		'Order, cook, and talk about your favorites.',
		'A1',
		'Food & drink',
		'green',
		'apple',
		`
apple|/ˈæp.əl/|quả táo|I eat an apple every day.
bread|/bred/|bánh mì|Would you like some bread?
rice|/raɪs/|cơm; gạo|We have rice for lunch.
milk|/mɪlk/|sữa|There is milk in the fridge.
egg|/eɡ/|quả trứng|I would like a boiled egg.
chicken|/ˈtʃɪk.ɪn/|thịt gà; con gà|We are having chicken for dinner.
coffee|/ˈkɒf.i/|cà phê|My dad drinks coffee.
hungry|/ˈhʌŋ.ɡri/|đói|I am hungry after school.
delicious|/dɪˈlɪʃ.əs/|ngon|This soup is delicious.
breakfast|/ˈbrek.fəst/|bữa sáng|Breakfast is ready.`
	),
	makeDeck(
		'travel',
		'Let’s go places',
		'Your next adventure starts with a word.',
		'A2',
		'Travel',
		'blue',
		'plane',
		`
airport|/ˈeə.pɔːt/|sân bay|We arrived at the airport early.
ticket|/ˈtɪk.ɪt/|vé|I bought a train ticket.
journey|/ˈdʒɜː.ni/|chuyến đi; hành trình|The journey takes two hours.
suitcase|/ˈsuːt.keɪs/|va li|My suitcase is very heavy.
passport|/ˈpɑːs.pɔːt/|hộ chiếu|Remember to bring your passport.
hotel|/həʊˈtel/|khách sạn|The hotel is near the beach.
direction|/daɪˈrek.ʃən/|hướng; phương hướng|Which direction is the station?
arrive|/əˈraɪv/|đến nơi|We arrive in Da Nang at noon.
explore|/ɪkˈsplɔː/|khám phá|Let us explore the old town.
map|/mæp/|bản đồ|Can you find our hotel on the map?`
	),
	makeDeck(
		'feelings',
		'A world of feelings',
		'Find the words for how you feel.',
		'A2',
		'People & culture',
		'pink',
		'heart',
		`
excited|/ɪkˈsaɪ.tɪd/|hào hứng|I am excited about our trip.
worried|/ˈwʌr.id/|lo lắng|She is worried about the test.
proud|/praʊd/|tự hào|I am proud of your progress.
lonely|/ˈləʊn.li/|cô đơn|He felt lonely in a new city.
friendly|/ˈfrend.li/|thân thiện|Our neighbors are friendly.
kind|/kaɪnd/|tốt bụng|It is kind of you to help.
surprised|/səˈpraɪzd/|ngạc nhiên|I was surprised by the gift.
calm|/kɑːm/|bình tĩnh|Stay calm and take a breath.
tired|/taɪəd/|mệt mỏi|I am tired after the walk.
hope|/həʊp/|hy vọng|I hope you feel better soon.`
	),
	makeDeck(
		'work',
		'Work & big ideas',
		'Build confidence, one conversation at a time.',
		'B1',
		'Work & study',
		'purple',
		'briefcase',
		`
achieve|/əˈtʃiːv/|đạt được|You can achieve your goals.
experience|/ɪkˈspɪə.ri.əns/|kinh nghiệm; trải nghiệm|This job requires some experience.
challenge|/ˈtʃæl.ɪndʒ/|thử thách|Learning a language is a challenge.
opportunity|/ˌɒp.əˈtʃuː.nə.ti/|cơ hội|This is a great opportunity.
colleague|/ˈkɒl.iːɡ/|đồng nghiệp|My colleague helped me today.
improve|/ɪmˈpruːv/|cải thiện|Practice helps you improve.
meeting|/ˈmiː.tɪŋ/|cuộc họp|The meeting starts at nine.
project|/ˈprɒdʒ.ekt/|dự án|We worked on a project together.
skill|/skɪl/|kỹ năng|Listening is an important skill.
success|/səkˈses/|sự thành công|Hard work led to success.`
	),
	makeDeck(
		'nature',
		'The world around us',
		'A little closer to nature, in English.',
		'B1',
		'Nature & science',
		'yellow',
		'sprout',
		`
environment|/ɪnˈvaɪ.rən.mənt/|môi trường|We must protect the environment.
climate|/ˈklaɪ.mət/|khí hậu|The climate is warm here.
wildlife|/ˈwaɪld.laɪf/|động vật hoang dã|The park is home to wildlife.
recycle|/ˌriːˈsaɪ.kəl/|tái chế|We recycle paper and plastic.
pollution|/pəˈluː.ʃən/|sự ô nhiễm|Air pollution affects our health.
forest|/ˈfɒr.ɪst/|rừng|We walked through the forest.
protect|/prəˈtekt/|bảo vệ|Trees help protect the soil.
energy|/ˈen.ə.dʒi/|năng lượng|Solar energy comes from the sun.
natural|/ˈnætʃ.ər.əl/|tự nhiên|This area has great natural beauty.
ocean|/ˈəʊ.ʃən/|đại dương|Plastic can harm life in the ocean.`
	),
	makeDeck(
		'opinions',
		'Ideas that matter',
		'Express your opinion with a little more clarity.',
		'B2',
		'People & culture',
		'pink',
		'message',
		`
perspective|/pəˈspek.tɪv/|quan điểm; góc nhìn|Try to see it from her perspective.
evidence|/ˈev.ɪ.dəns/|bằng chứng|There is evidence to support the claim.
assumption|/əˈsʌmp.ʃən/|giả định|We should question that assumption.
convince|/kənˈvɪns/|thuyết phục|The results convinced me.
consequence|/ˈkɒn.sɪ.kwəns/|hậu quả; hệ quả|Every choice has a consequence.
approach|/əˈprəʊtʃ/|cách tiếp cận|Let us try a different approach.
significant|/sɪɡˈnɪf.ɪ.kənt/|đáng kể; quan trọng|She made significant progress.
benefit|/ˈben.ɪ.fɪt/|lợi ích|Exercise has many benefits.
debate|/dɪˈbeɪt/|cuộc tranh luận; tranh luận|We had a debate about education.
consider|/kənˈsɪd.ə/|cân nhắc; xem xét|Consider all the options first.`
	),
	makeDeck(
		'innovation',
		'Tomorrow, today',
		'Discover the language of new possibilities.',
		'B2',
		'Nature & science',
		'blue',
		'bulb',
		`
innovation|/ˌɪn.əˈveɪ.ʃən/|sự đổi mới; sáng kiến|Innovation can improve our lives.
sustainable|/səˈsteɪ.nə.bəl/|bền vững|We need sustainable solutions.
efficient|/ɪˈfɪʃ.ənt/|hiệu quả|This machine is more efficient.
develop|/dɪˈvel.əp/|phát triển|They develop new technology.
research|/rɪˈsɜːtʃ/|nghiên cứu|The research took three years.
solution|/səˈluː.ʃən/|giải pháp|We found a simple solution.
impact|/ˈɪm.pækt/|tác động|Small actions can have a big impact.
resource|/rɪˈzɔːs/|nguồn tài nguyên; nguồn lực|Water is a valuable resource.
adapt|/əˈdæpt/|thích nghi; điều chỉnh|We need to adapt to change.
potential|/pəˈten.ʃəl/|tiềm năng|This idea has great potential.`
	),
	makeDeck(
		'academic',
		'Think a little deeper',
		'Make room for more precise expression.',
		'C1',
		'Work & study',
		'purple',
		'graduation',
		`
comprehensive|/ˌkɒm.prɪˈhen.sɪv/|toàn diện|The report offers a comprehensive overview.
ambiguous|/æmˈbɪɡ.ju.əs/|mơ hồ; đa nghĩa|The instructions were ambiguous.
coherent|/kəʊˈhɪə.rənt/|mạch lạc; nhất quán|She presented a coherent argument.
hypothesis|/haɪˈpɒθ.ə.sɪs/|giả thuyết|The experiment tested our hypothesis.
interpret|/ɪnˈtɜː.prɪt/|diễn giải; giải thích|How do you interpret these results?
underlying|/ˌʌn.dəˈlaɪ.ɪŋ/|tiềm ẩn; cơ bản|We examined the underlying causes.
constraint|/kənˈstreɪnt/|sự hạn chế; ràng buộc|Time was our main constraint.
substantial|/səbˈstæn.ʃəl/|đáng kể; lớn|The project requires substantial effort.
justify|/ˈdʒʌs.tɪ.faɪ/|biện minh; chứng minh là hợp lý|Can you justify your decision?
insight|/ˈɪn.saɪt/|sự hiểu biết sâu sắc|The study provides insight into learning.`
	),
	makeDeck(
		'connections',
		'Meaningful connections',
		'Understand people beyond the small talk.',
		'C1',
		'People & culture',
		'peach',
		'heart',
		`
empathy|/ˈem.pə.θi/|sự đồng cảm|Empathy helps us understand others.
resilience|/rɪˈzɪl.i.əns/|khả năng phục hồi; sự kiên cường|She showed resilience during difficult times.
authentic|/ɔːˈθen.tɪk/|chân thực; đích thực|We value authentic conversations.
vulnerable|/ˈvʌl.nər.ə.bəl/|dễ bị tổn thương|It is natural to feel vulnerable.
reciprocal|/rɪˈsɪp.rə.kəl/|có qua có lại; tương hỗ|Respect should be reciprocal.
compassion|/kəmˈpæʃ.ən/|lòng trắc ẩn|Treat people with compassion.
perception|/pəˈsep.ʃən/|nhận thức; cách nhìn nhận|Experience shapes our perception.
prejudice|/ˈpredʒ.ə.dɪs/|định kiến|Education can challenge prejudice.
integrity|/ɪnˈteɡ.rə.ti/|sự chính trực|She is respected for her integrity.
belonging|/bɪˈlɒŋ.ɪŋ/|cảm giác thuộc về|The club gave me a sense of belonging.`
	),
	makeDeck(
		'nuance',
		'The art of nuance',
		'Small differences. Richer conversations.',
		'C2',
		'People & culture',
		'green',
		'feather',
		`
ephemeral|/ɪˈfem.ər.əl/|phù du; ngắn ngủi|The beauty of the blossom is ephemeral.
meticulous|/məˈtɪk.jə.ləs/|tỉ mỉ; kỹ lưỡng|Her notes are meticulous.
eloquent|/ˈel.ə.kwənt/|hùng hồn; lưu loát|He gave an eloquent speech.
serendipity|/ˌser.ənˈdɪp.ə.ti/|sự tình cờ may mắn|Finding that book was pure serendipity.
nuance|/ˈnjuː.ɑːns/|sắc thái tinh tế|Translation can lose a nuance of meaning.
poignant|/ˈpɔɪ.njənt/|gây xúc động sâu sắc|It was a poignant reminder of home.
quintessential|/ˌkwɪn.tɪˈsen.ʃəl/|điển hình nhất; tinh túy|This is a quintessential summer scene.
ineffable|/ɪˈnef.ə.bəl/|không thể diễn tả bằng lời|They felt an ineffable joy.
perceptive|/pəˈsep.tɪv/|sâu sắc; nhạy bén|That is a perceptive observation.
subtlety|/ˈsʌt.əl.ti/|sự tinh tế|The poem rewards attention to subtlety.`
	),
	makeDeck(
		'critical',
		'Beyond the obvious',
		'Explore complex ideas with confidence.',
		'C2',
		'Work & study',
		'yellow',
		'bulb',
		`
paradigm|/ˈpær.ə.daɪm/|mô hình; hệ hình|The discovery changed the scientific paradigm.
dichotomy|/daɪˈkɒt.ə.mi/|sự phân đôi; sự đối lập|This is a false dichotomy.
corroborate|/kəˈrɒb.ə.reɪt/|xác nhận; chứng thực|The new data corroborate the findings.
empirical|/ɪmˈpɪr.ɪ.kəl/|dựa trên thực nghiệm|We need empirical evidence.
intrinsic|/ɪnˈtrɪn.zɪk/|nội tại; vốn có|Curiosity has intrinsic value.
pragmatic|/præɡˈmæt.ɪk/|thực dụng; thực tế|We took a pragmatic approach.
reconcile|/ˈrek.ən.saɪl/|dung hòa; hòa giải|We must reconcile these different views.
unequivocal|/ˌʌn.ɪˈkwɪv.ə.kəl/|rõ ràng; dứt khoát|Her answer was unequivocal.
scrutinize|/ˈskruː.tɪ.naɪz/|xem xét kỹ lưỡng|Researchers scrutinize the evidence.
synthesis|/ˈsɪn.θə.sɪs/|sự tổng hợp|The essay is a synthesis of several ideas.`
	),
];
