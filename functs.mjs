import { spawn } from 'child_process';
import fsExtra from 'fs-extra';
import process from 'process';

const { outputFileSync } = fsExtra;

export function decodeBase64(data) {
  const buff = Buffer.from(data, 'base64');

  return buff.toString('ascii');
}

export async function runSpawn(command, args) {
  return new Promise((resolve, reject) => {
    const buildSpawn = spawn(command, args, { stdio: [0, 1, 2] });

    buildSpawn
      .on('exit', (exitCode) => {
        if (exitCode !== 0) {
          return reject(
            new Error(
              `The command '${command}' exited with exit-code: ${exitCode}`
            )
          );
        }

        return resolve();
      })
      .on('error', (error) => {
        return reject(error);
      });
  });
}

/**
 * Convert a base64 encoded env file to temp file
 * @param {string} envKey
 * @param {string} tempFilePath
 * @returns {Promise<string>}
 */
export async function base64EnvValueToTmpFile({ envKey, tempFilePath }) {
  const envData = process.env[envKey];

  if (!envData) {
    throw new Error(`'${envKey}' environment value is missing`);
  }

  const gcpKeyJsonData = decodeBase64(envData);

  try {
    outputFileSync(tempFilePath, gcpKeyJsonData);
  } catch (e) {
    throw new Error(`'${envKey}' environment to tmp file error: ${e}`);
  }

  return tempFilePath;
}

export function undefinedOrNull(v) {
  return typeof v === 'undefined' || v === null;
}

export function addMissingTrailingSlash(text) {
  return text.replace(/\/?$/, '/');
}

export function stripPrefix(text, prefix) {
  const hasPrefix = text.indexOf(prefix) === 0;
  return hasPrefix ? text.substr(prefix.length) : text.toString();
}
