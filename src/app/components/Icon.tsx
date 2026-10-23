import {
	Apple,
	BookOpen,
	BriefcaseBusiness,
	Feather,
	GraduationCap,
	Heart,
	Lightbulb,
	MessageCircle,
	Plane,
	Sprout,
	Sun,
} from 'lucide-react';
const icons = {
	apple: Apple,
	sun: Sun,
	plane: Plane,
	heart: Heart,
	briefcase: BriefcaseBusiness,
	sprout: Sprout,
	message: MessageCircle,
	bulb: Lightbulb,
	graduation: GraduationCap,
	feather: Feather,
	book: BookOpen,
};
export function TopicIcon({ name, size = 30 }: { name: string; size?: number }) {
	const Icon = icons[name as keyof typeof icons] || BookOpen;
	return <Icon size={size} strokeWidth={1.6} />;
}
