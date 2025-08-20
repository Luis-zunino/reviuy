import React from "react";

export const Footer = () => {
  return (
    <div className="flex flex-col justify-between w-full bg-black lg:px-44 lg:py-24 p-6 text-white">
      <div className="flex lg:flex-row gap-8 lg:justify-between flex-col lg:text-left text-center lg:mt-0 mt-8">
        <div className="lg:w-[280px]">
          <h4 className="font-extrabold text-base lg:text-2xl lg:block mb-4">
            Ayudémonos para tomar la mejor decisión a la hora de alquilar
          </h4>
        </div>
        <div className="lg:text-left">
          <ul className="flex flex-col gap-4">
            <li className="text-purple-300 font-bold">Empresa</li>
            <li className="cursor-pointer">
              <a title="Información sobre Reviu" href="/es/sobre-nosotros">
                Sobre Nosotros
              </a>
            </li>
            <li>info@reviUy.com</li>
          </ul>
        </div>
        <div className="lg:text-left">
          <ul className="flex flex-col gap-4">
            <li className="text-purple-300 font-bold">Recursos</li>
            <li className="cursor-pointer">
              <a title="Publicaciones del blog de Reviu" href="/es/blog">
                Blog
              </a>
            </li>
          </ul>
        </div>
        <div className="lg:text-left">
          <ul className="flex flex-col gap-4">
            <li className="text-purple-300 font-bold">Legal</li>
            <li className="cursor-pointer">
              <a title="Política de privacidad" href="/es/politica-privacidad">
                Política de privacidad
              </a>
            </li>
            <li className="cursor-pointer">
              <a title="Aviso legal de Reviu" href="/es/aviso-legal">
                Aviso Legal
              </a>
            </li>
            <li className="cursor-pointer">
              <a
                title="Términos y condiciones de uso"
                href="/es/condiciones-uso"
              >
                Términos y condiciones
              </a>
            </li>
            <li className="cursor-pointer">
              <a title="Página de cookies" href="/es/cookies">
                Cookies
              </a>
            </li>
            <li className="cursor-pointer">
              <a
                title="Protocolo de buenas prácticas"
                href="/es/protocolo-buenas-practicas"
              >
                Protocolo de buenas prácticas
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex lg:flex-row lg:justify-between flex-col items-center mt-12 ">
        ReviUy
        <div className="flex items-center lg:justify-between justify-evenly my-10 gap-3 xs:gap-5 xs:flex-col">
          <div className="relative max-w-[168px]" data-headlessui-state="">
            <div>
              <button
                className="flex items-center bg-white rounded-lg p-1 border w-auto"
                id="headlessui-menu-button-:r76:"
                type="button"
                aria-haspopup="menu"
                aria-expanded="false"
                data-headlessui-state=""
              >
                <span className="text-gray-800 m-2">Español</span>
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="text-gray-800  m-2"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
