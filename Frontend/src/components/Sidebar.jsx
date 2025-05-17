import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UserIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Streamify
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <Link
          to={"/"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case
            ${currentPath === "/" ? "btn-active" : ""}`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>
        {/* friends */}
        <Link
          to={"/friends"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case
            ${currentPath === "/friends" ? "btn-active" : ""}`}
        >
          <UserIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>
        {/* notification */}
        <Link
          to={"/notification"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case
            ${currentPath === "/notification" ? "btn-active" : ""}`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notification</span>
        </Link>
      </nav>


      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullname}</p>
            <p className="text-xs text-success flex items-center gap-1 tracking-wider">
              <span className="size-2 rounded-full bg-success inline-block" />
              Active
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
