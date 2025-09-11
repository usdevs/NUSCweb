export default function GroupLoading() {
  return (
    <div
      className={`flex min-h-[calc(100vh-160px)] items-center justify-center`}
    >
      <div className='text-center'>
        <div
          className={`mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2 border-[#FF7D4E]`}
        ></div>
        <p className='text-gray-600'>Loading student groups...</p>
      </div>
    </div>
  );
}
