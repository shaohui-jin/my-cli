class AdvancedConsole {
  static log(...args) {
    const timestamp = new Date().toLocaleString();
    const formattedArgs = args.map(arg => JSON.stringify(arg)).join(" ");
    console.log(`[${timestamp}] ${formattedArgs}`);
  }
  static info(...args) {
    const timestamp = new Date().toLocaleString();
    const formattedArgs = args.map(arg => JSON.stringify(arg)).join(" ");
    console.log(`[${timestamp}] ℹ️ %c${formattedArgs}`, "color: blue; font-weight: bold;");
  }
  static warn(...args) {
    const timestamp = new Date().toLocaleString();
    const formattedArgs = args.map(arg => JSON.stringify(arg)).join(" ");
    console.log(`[${timestamp}] ⚠️ %c${formattedArgs}`, "color: orange; font-weight: bold;");
  }
  static error(...args) {
    const timestamp = new Date().toLocaleString();
    const formattedArgs = args.map(arg => JSON.stringify(arg)).join(" ");
    console.log(`[${timestamp}] ❌ %c${formattedArgs}`, "color: red; font-weight: bold;");
  }
}

export default AdvancedConsole
