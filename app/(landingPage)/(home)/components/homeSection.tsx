import { Button } from "@/app/_components/ui/button";
import Image from "next/image";

const HomeSection = () => {
  return (
    <div className="items-center h-full min-h-[100vh] w-full bg-[url('/homeBg.jpg')] bg-cover bg-center">
      <div className="flex flex-col justify-center items-center h-[50%] ">
        <h1 className=" relative text-5xl font-extrabold text-center text-white text-shadow">
          <span className="absolute top-0 left-0 text-black -z-10 blur-sm">
            Conectando você ao futuro!
          </span>
          Conectando você ao futuro!
        </h1>

        <Button
          size="lg"
          variant="secondary"
          className="mt-4 hover:bg-primary hover:text-white group flex items-center "
        >
          <Image
            src="/whatsAppIconBlack.svg"
            alt="whatsAppIcon"
            width={16}
            height={16}
            className="group-hover:hidden"
          />
          <Image
            src="/whatsAppIconWhite.svg"
            alt="whatsAppIconHover"
            width={16}
            height={16}
            className="hidden group-hover:block"
          />
          <p className=" font-bold text-lg">Falar com um especialista</p>
        </Button>
      </div>
      <div className="h-[50%] w-auto min-w-[100%] relative">
        <Image
          src="/homePerson.png"
          alt="homePerson"
          layout="fill"
          objectFit="cover"
          className="absolute bottom-0"
        />
      </div>
    </div>
  );
};

export default HomeSection;
