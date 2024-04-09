import styles from "@/styles/modal.module.css";
import { Loader } from "@/app/components/Loader";

export default function GlobalLoading() {
  return (
    <div
      className={`fixed inset-0 z-50 flex h-dvh w-dvw items-center justify-center bg-background bg-opacity-20 backdrop-blur-sm ${styles["bg-in"]} p-4`}
    >
      <div
        className={`m-auto h-fit w-fit ${styles["modal-in"]}`}
        style={{
          maxWidth: "90dvw",
          maxHeight: "90dvh",
        }}
      >
        <Loader />
      </div>
    </div>
  );
}
