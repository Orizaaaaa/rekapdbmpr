'use client'
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { capitalizeWords } from "@/utils/helper";
import { profile } from "@/app/image";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  // Mengambil data dari localStorage setelah komponen dirender di client
  useEffect(() => {
    setName(localStorage.getItem('name'));
    setRole(localStorage.getItem('role'));
  }, []);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative">
      <div className="flex items-center gap-4"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {name ? capitalizeWords(name) : "User"}
          </span>
          <span className="block text-xs">
            {role ? capitalizeWords(role) : "Pengguna"}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={profile}
            style={{
              width: "auto",
              height: "auto",
            }}
            alt="User"
          />
        </span>
      </div>

      {/* <!-- Dropdown Start --> */}

      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;
