import { WiDayWindy, WiThermometer } from "react-icons/wi";
import { FaCloud, FaVideo, FaMapMarkerAlt, FaTrash, FaHome } from "react-icons/fa";
import { GiWindsock } from "react-icons/gi";
import { MdPropaneTank } from "react-icons/md";
import { BsCloudRainHeavyFill } from "react-icons/bs";
import { FaTowerBroadcast } from "react-icons/fa6";
import { MdSatellite } from "react-icons/md";
import { RiRoadMapLine } from "react-icons/ri";

const cn = "text-blue-500 ";

export const ICONS = {
  WiDaySunny: <WiDayWindy className={cn} />,
  FaCloud: <FaCloud className={cn} />,
  FaVideo: <FaVideo className={cn} />,
  WiThermometer: <WiThermometer className={cn} />,
  GiWindsock: <GiWindsock className={`${cn} text-orange-500`} />,
  MdPropaneTank: <MdPropaneTank className={`${cn} text-yellow-500`} />,
  BsCloudRainHeavyFill: <BsCloudRainHeavyFill className={`${cn} text-blue-950`} />,
  FaMapMarkerAlt: <FaMapMarkerAlt className={cn} />,
  FaTrash: <FaTrash className={`${cn} text-danger`} />,
  FaTower: <FaTowerBroadcast className={`${cn} text-black`} />,
  satellite: (ncls) => <MdSatellite className={`${ncls ? ncls : cn}`} />,
  roadmap: (ncls) => <RiRoadMapLine className={`${ncls ? ncls : cn}`} />,
  marker: <FaMapMarkerAlt className={`${cn}`} />,
  home: <FaHome className={cn} />,
};
