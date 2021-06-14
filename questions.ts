export default function App() {
  const [availableLayouts, setAvailableLayouts] = useState(localStorageLayouts);
  useEffect(() => {
    setAvailableLayouts(localStorageLayouts);
  }, [availableLayouts]);

  return (
    //...
    <div>
      <OkNotToUpdate />
      <ShouldUpdate />
      <OkNotToUpdate />
      <ShouldUpdate layouts={availableLayouts} />
      <OkNotToUpdate />
    </div>
  );
}
