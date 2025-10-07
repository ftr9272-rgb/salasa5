import "./index.css";

export default function CSSTest() {
  return (
    <div className="p-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-4">CSS Test</h1>
      <p className="mb-4">If you can see this text with proper styling, CSS is working.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Card 1</h2>
          <p>This should have card styling.</p>
        </div>
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Card 2</h2>
          <p>This should also have card styling.</p>
        </div>
      </div>
    </div>
  );
}