export default function MiniNavbar() {
    const navlinks = ["About Us", "Our Mission", "Our Vision", "Testimonials"]

    return (
        <div className="flex gap-10 mb-20">
            {navlinks.map((value, index) => {
                return (
                    <ul key={index} className="items-center font-bold text-green-700">
                        <li className="border-2 border-green-700 px-8 py-2 rounded-full ">{value}</li>
                    </ul>
                )
            })}
        </div>
    )
}