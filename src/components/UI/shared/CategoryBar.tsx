import React from 'react'

export interface CategoryItem {
  label: string
  icon: string
  tag: string
}

interface CategoryBarProps {
  categories: CategoryItem[]
  value: string
  onChange: (tag: string) => void
  className?: string
}

// Reusable horizontal icon-based category selector (from Search.tsx)
const CategoryBar: React.FC<CategoryBarProps> = ({ categories, value, onChange, className = '' }) => {
  return (
    <div
      className={
        `grid grid-cols-5 gap-2 place-items-center h-auto px-0 py-0 overflow-y-hidden ` +
        `md:flex md:overflow-x-auto md:overflow-y-hidden md:h-20 md:px-0 md:py-0 md:items-center md:justify-between md:scrollbar-hide ` +
        `transform-gpu ` +
        `${className}`
      }
      data-aos='fade-up'
      data-aos-duration='600'
      data-aos-easing='ease-out-cubic'
      data-aos-once='true'
      style={{ willChange: 'transform' }}
    >
      {categories.map((cat) => (
        <button
          key={cat.tag}
          type="button"
          onClick={() => onChange(cat.tag)}
          className={`flex flex-col items-center justify-center text-[13px] leading-none h-[64px] md:h-20 min-w-0 md:min-w-[80px] text-gray-500 cursor-pointer transition-transform transition-colors duration-200 hover:text-purple-500 hover:-translate-y-0.5 ${
            value === cat.tag ? 'text-purple-500 font-bold' : 'font-medium'
          }`}
        >
          <i
            className={`${cat.icon} text-[22px] mb-1.5 ${
              value === cat.tag ? 'bg-purple-500 text-white rounded-full p-1.5 w-[35px] h-[35px] flex justify-center items-center' : ''
            }`}
          />
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  )
}

export default CategoryBar
