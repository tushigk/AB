/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "react-modal";
import useSWR, { useSWRConfig } from "swr";
import { paymentApi } from "@/apis";
import { message } from "@/utils/toast";

type PaymentUrl = {
  link: string;
  logo: string;
  name: string;
  description: string;
};

type Payment = {
  invoice_id: string;
  qr_image: string;
  urls: PaymentUrl[];
};

type PaymentStatus = {
  status: "PAID" | "PENDING" | string;
};

type Props = {
  setSuccessModalOpen: Dispatch<SetStateAction<boolean>>;
  successModalOpen: boolean;
  payment?: Payment;
  loading: boolean;
  onPaid?: () => void;
};

const PaymentModal = ({
  setSuccessModalOpen,
  successModalOpen,
  payment,
  loading,
  onPaid,
}: Props) => {
  const { mutate: listMutate } = useSWRConfig();

  const { data: paymentStatus, isValidating, mutate } = useSWR<PaymentStatus>(
    payment?.invoice_id ? `swr.qpay.status.${payment.invoice_id}` : null,
    async () => {
      if (!payment) return null;
      return await paymentApi.getPaymentStatus(payment.invoice_id);
    },
    {
      onSuccess(data) {
        if (data?.status === "PAID") {
          listMutate("swr.user.me");
          message.success("Төлбөр амжилттай хийгдлээ.");
          setSuccessModalOpen(false);
          onPaid?.();
        }
      },
      refreshInterval: 5000,
    }
  );

  const handleCheckPayment = async () => {
    await mutate();
    if (paymentStatus?.status === "PAID") {
      message.success("Төлбөр төлөгдсөн");
      setSuccessModalOpen(false);
      onPaid?.();
    } else {
      message.error("⏳ Төлбөр хараахан хийгдээгүй байна.");
    }
  };

  return (
    <AnimatePresence>
      {successModalOpen && (
        <Modal
          isOpen={successModalOpen}
          onRequestClose={() => setSuccessModalOpen(false)}
          appElement={document.getElementById("__next")!}
          ariaHideApp={false}
          className="relative mx-auto my-12 max-w-5xl w-full rounded-2xl bg-neutral-900 p-6 outline-none"
          overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4"
          >
            <div className="flex justify-center items-center md:max-w-[350px]">
              {loading || !payment ? (
                <div className="w-72 h-72 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-700 animate-pulse" />
              ) : (
                <motion.img
                  src={`data:image/png;base64,${payment.qr_image}`}
                  alt="QR code"
                  className="w-72 h-72 object-contain rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                />
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 mt-4 md:mt-0">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
                Төлбөрийн суваг
              </h2>

              {loading || !payment ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800 animate-pulse"
                    >
                      <div className="w-10 h-10 rounded-md bg-neutral-700" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 rounded bg-neutral-700" />
                        <div className="h-3 w-1/2 rounded bg-neutral-700" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                  {payment.urls.map((u, i) => (
                    <motion.a
                      key={i}
                      href={u.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0 },
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition text-white"
                    >
                      <img
                        src={u.logo}
                        alt={u.name}
                        className="w-10 h-10 rounded-md object-contain"
                      />
                      <div>
                        <p className="text-white font-medium line-clamp-1">{u.description}</p>
                        <p className="text-gray-400 text-sm line-clamp-1">{u.name}</p>
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          <button
            onClick={() => setSuccessModalOpen(false)}
            className="absolute top-3 right-3 text-white hover:text-blue-500"
          >
            ✕
          </button>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setSuccessModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition"
            >
              Гарах
            </button>
            <button
              onClick={handleCheckPayment}
              disabled={isValidating}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50"
            >
              {isValidating ? "Шалгаж байна..." : "Төлбөр шалгах"}
            </button>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
