const { spawn } = require("child_process");

const executePython = async (script, args) => {
  const mappedArgs = args.map((arg) => arg.toString());

  const py = spawn("python3", [script, ...mappedArgs]);

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

module.exports = { executePython };
