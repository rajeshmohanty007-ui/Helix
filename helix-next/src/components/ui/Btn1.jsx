import Link from "next/link"

const Btn1 = ({icon, label, coll, active, hClick, path}) => {
  return (
    <Link href={path} className={`flex items-center gap-2 px-2 py-4 border border-(--border-color) rounded-2xl backdrop-blur-xl shadow-xl cursor-pointer ` + (active? `bg-(--accent) text-white`: `bg-(--bg-card) hover:bg-(--bg-hover) transition`)} onClick={hClick}>
        <div className={`transition ` + (coll? `m-auto`:``)}>
            {icon}
        </div>
        {!coll && <div>
            {label}
        </div>}
    </Link>
  )
}

export default Btn1