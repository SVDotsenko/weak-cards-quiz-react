function Toast({ toast }) {
  return (
    toast && (
      <div className={`toast ${toast.type}`} role="status">
        {toast.message}
      </div>
    )
  );
}

export default Toast;
