import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
export function Modal({
	title,
	subtitle,
	onClose,
	children,
	wide = false,
}: {
	title: string;
	subtitle?: string;
	onClose: () => void;
	children: ReactNode;
	wide?: boolean;
}) {
	const ref = useRef<HTMLDialogElement>(null);
	useEffect(() => {
		const dialog = ref.current!;
		const before = document.activeElement as HTMLElement;
		dialog.showModal();
		const old = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			dialog.close();
			document.body.style.overflow = old;
			before?.focus();
		};
	}, []);
	return (
		<dialog
			ref={ref}
			className={`modal ${wide ? 'wide' : ''}`}
			onCancel={onClose}
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					const r = e.currentTarget.getBoundingClientRect();
					if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
						onClose();
					}
				}
			}}
			aria-labelledby="modal-title"
		>
			<div className="modal-head">
				<div>
					<h2 id="modal-title">{title}</h2>
					{subtitle && <p>{subtitle}</p>}
				</div>
				<button className="icon-button" aria-label="Close dialog" onClick={onClose}>
					<X size={21} />
				</button>
			</div>
			{children}
		</dialog>
	);
}
