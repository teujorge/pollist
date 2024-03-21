import styles from "@/styles/blob.module.css";

export function BlobBg() {
  return (
    <div className="fixed left-0 top-0 z-0 h-full w-full scale-150 blur-2xl [&>div]:absolute [&>div]:left-1/2 [&>div]:top-1/2 [&>div]:-translate-x-1/2 [&>div]:-translate-y-1/2 [&>div]:transform [&>div]:rounded-full [&>div]:opacity-50 [&>div]:filter">
      <div
        className={`bg-purple-300 ${styles.blob1}`}
        style={{
          width: "calc(min(30vw, 30vh))",
          height: "calc(min(30vw, 30vh))",
        }}
      />
      <div
        className={`bg-primary ${styles.blob2}`}
        style={{
          width: "calc(min(40vw, 40vh))",
          height: "calc(min(40vw, 40vh))",
        }}
      />
      <div
        className={`bg-purple-900 ${styles.blob3}`}
        style={{
          width: "calc(min(30vw, 30vh))",
          height: "calc(min(30vw, 30vh))",
        }}
      />
    </div>
  );
}
