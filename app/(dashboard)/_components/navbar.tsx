"use client"
import { UserButton } from '@clerk/nextjs'
import { SearchInput } from './search-input'

const Navbar = () => {
  return (
    <div className="flex items-center gap-x-5 p-5">
        <div className="hidden md:flex flex-1">
            <SearchInput />
        </div>
        <UserButton />
    </div>
  )
}

export default Navbar