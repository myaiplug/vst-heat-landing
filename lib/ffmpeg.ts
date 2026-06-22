import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

async function getFFmpeg(onProgress?: (progress: number) => void) {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) onProgress(Math.round(progress * 100));
  });

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
}

export async function processWithVidScrew(
  file: File,
  settings: any,
  onProgress: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg(onProgress);

  const inputName = `input${file.name.slice(file.name.lastIndexOf('.'))}`;
  const outputName = 'output.mp4';

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const { speed, pitch, effect, colorGrade, intensity } = settings;
  const pts = (1 / speed).toFixed(3);

  let vfilter = `[0:v]setpts=${pts}*PTS`;

  if (effect === 'purple-double') {
    vfilter += `,split=3[base][dup][dup2]; color=c=purple:s=1080x1920,format=rgba,colorchannelmixer=aa=${0.5 * intensity}[purple]; [base][purple]overlay=0:0[with_purple]; [with_purple][dup]overlay=8:0`;
  } else if (effect === 'datamosh') {
    vfilter += `,minterpolate=fps=30:mb_size=16:search_param=400:vsbmc=1:scd=none`;
  } else if (effect === 'chromatic-trippy') {
    vfilter += `,geq='r=128+sin(2*PI*t)*80:g=0:b=200',tblend=all_mode=average`;
  }

  if (colorGrade === 'cinematic') {
    vfilter += `,curves=preset=vintage,eq=contrast=1.2:brightness=0.02:saturation=1.15`;
  } else if (colorGrade === 'syrup') {
    vfilter += `,unsharp=5:5:1.5:5:5:1.0,colorbalance=rs=0.15:gs=-0.1:bs=0.2`;
  }

  const afilter = `[0:a]rubberband=tempo=${speed}:pitch=${pitch}`;
  const filterComplex = `${vfilter}; ${afilter}`;

  await ffmpeg.exec([
    '-i', inputName,
    '-filter_complex', filterComplex,
    '-map', '[v]',
    '-map', '[a]',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-metadata', `screw_speed=${speed}`,
    '-metadata', `pitch=${pitch}`,
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return new Blob([data], { type: 'video/mp4' });
}
