'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface LinkHeaderProps {
  children: ReactNode
  path: string
}

export function LinkHeader({ path, children }: LinkHeaderProps) {
  const pathName = usePathname()

  const isActive =
    'font-bold text-white after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-t-sm after:bg-yellow-500 after:content-[""]'

  return (
    <Link
      href={path}
      className={`relative inline-block rounded-sm px-2 py-6 transition-colors hover:text-white
      ${path === pathName ? isActive : ''}`}
    >
      {children}
    </Link>
  )
}
