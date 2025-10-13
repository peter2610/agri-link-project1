export default function Footer() {
    return (
        <footer className="bg-green-500 px-32 py-16">
            <div className="flex justify-between items-center">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="font-bold text-neutral-50 text-xl">AgriLink</div>
                </div>
                <div className="text-neutral-50">© {new Date().getFullYear()} AgriLink — Collaboration Platform for farmers</div>
            </div>
        </footer>
    )
}