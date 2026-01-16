// src/components/InvoiceModal.tsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { CheckCircle, Printer } from "lucide-react";

// Tipe data untuk prop
type InvoiceData = {
  id: string;
  nama: string;
  total: number;
  metode: string;
  tanggal: string;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: InvoiceData;
};

// Fungsi format Rupiah
const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

// Warna gold
const goldColor = "#b99556";

const InvoiceModal = ({ isOpen, onClose, data }: ModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-center align-middle shadow-xl transition-all">
                <CheckCircle size={60} className="mx-auto text-green-500" />

                <Dialog.Title
                  as="h3"
                  className="mt-4 text-2xl font-bold leading-6 text-gray-900"
                >
                  Terima Kasih!
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Pesanan Anda telah Kami terima dan akan segera Kami proses.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Tagihan</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatRupiah(data.total)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-4 text-left">
                    <div>
                      <p className="text-xs text-gray-500">ID Pesanan</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nama Pembeli</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.nama}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Metode Pembayaran</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.metode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tanggal Pemesanan</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.tanggal}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm hover:opacity-90"
                    style={{ backgroundColor: goldColor }}
                    onClick={onClose} // Nanti ini bisa diganti 'print'
                  >
                    <Printer size={18} className="mr-2" />
                    Cetak Bukti Pesanan
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InvoiceModal;
