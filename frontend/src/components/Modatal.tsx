import React from 'react';

export type ModalProps = {
  open: boolean;
  onNegative: () => void;
  onPositive: () => void;
  title: string;
  message: string;
  labelPositive?: string;
  labelNegative?: string;
};

const Modal = ({
  open,
  onNegative,
  onPositive,
  title,
  message,
  labelPositive = 'OK',
  labelNegative = 'キャンセル',
}: ModalProps) => {
  return open ? (
    <>
      <div className="absolute left-1/2 top-1/2 z-20 flex h-48 w-80 -translate-x-1/2 -translate-y-1/2 transform flex-col items-start bg-white p-5">
        <h1 className="mb-5 text-xl font-bold">{title}</h1>
        <p className="mb-5 text-lg">{message}</p>
        <div className="mt-auto flex w-full">
          <button
            className="mx-auto bg-slate-900 px-8 py-2 text-white hover:bg-slate-700"
            onClick={() => onNegative()}
          >
            {labelNegative}
          </button>
          <button
            className="mx-auto bg-slate-900 px-8 py-2 text-white hover:bg-slate-700"
            onClick={() => onPositive()}
          >
            {labelPositive}
          </button>
        </div>
      </div>
      <div
        className="fixed z-10 h-full w-full bg-black bg-opacity-50"
        onClick={() => onNegative()}
      ></div>
    </>
  ) : (
    <></>
  );
};

export default Modal;
