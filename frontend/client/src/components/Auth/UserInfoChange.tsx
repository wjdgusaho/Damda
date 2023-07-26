import React from "react"
import { Link } from "react-router-dom"

export const UserInfoChange = function () {
  return (
    <div className="flex flex-initial justify-between w-96 mx-auto">
      <Link
        to={"/menu"}
        style={{ fontSize: "30px", color: "white", marginLeft: "30px" }}
      >
        <svg
          className="w-6 h-6 text-black-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 8 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
          />
        </svg>
      </Link>
      <Link to={"/main"} className="grid grid-cols-2 text-center">
        <img
          style={{ marginLeft: "13px" }}
          src="/assets/icons/home.png"
          alt="home"
          width={25}
        />
        <p>홈으로</p>
      </Link>
    </div>
  )
}
