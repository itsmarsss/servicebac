const { spawn } = require("child_process");

let pythonCmd = "python";

const executePython = async (script, args) => {
  const mappedArgs = args.map((arg) => arg.toString());

  const py = spawn(pythonCmd, [script, ...mappedArgs]);

  const result = await new Promise((resolve, reject) => {
    let output;

    // Get output from python script
    py.stdout.on("data", (data) => {
      output = JSON.parse(data);
    });

    // Handle erros
    py.stderr.on("data", (data) => {
      console.error(`[python3] Error occured: ${data}`);
      reject(`Error occured in ${script}`);
    });

    // Handle exit
    py.on("exit", (code) => {
      console.log(`Child process exited with code ${code}`);
      resolve(output);
    });
  });

  return result;
};

const isCommandAvailable = (command, args) => {
  return new Promise((resolve) => {
    const child = spawn(command, args);

    child.on('error', (error) => {
      resolve(false);
    });

    child.on('exit', (code) => {
      resolve(true);
    });
  });
};

const isPythonAvailable = async () => {
  const python3 = await isCommandAvailable("python3", ["--version"]);
  console.log(`Python3 available: ${python3}`);

  const python = await isCommandAvailable("python", ["--version"]);
  console.log(`Python available: ${python}`);

  if (python3) {
    pythonCmd = "python3";
    return true;
  } else if (python) {
    pythonCmd = "python";
    return true;
  } else {
    return false;
  }
}

module.exports = { executePython, isPythonAvailable };
