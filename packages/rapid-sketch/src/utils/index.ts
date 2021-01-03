export function promisfyCanvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        blob ? resolve(blob) : reject();
      });
    } catch (err) {
      reject(err);
    }
  });
}

export async function saveBlob(blob: Blob, name: string) {
  const form = new window.FormData();
  form.append("file", blob, name);
  try {
    const res = await window.fetch("/record/saveBlob", {
      method: "POST",
      cache: "no-cache",
      credentials: "same-origin",
      body: form,
    });
    if (res.status === 200) {
      return res.json();
    } else {
      return res.text().then((text) => {
        throw new Error(text);
      });
    }
  } catch (err) {
    // Some issue, just bail out and return nil hash
    // console.warn(`There was a problem exporting ${opts.filename}`);
    console.error(err);
    return undefined;
  }
}

export async function sendStreamBlob(canvas: HTMLCanvasElement) {
  const blob = await promisfyCanvasToBlob(canvas);

  const form = new window.FormData();
  form.append("file", blob, "frame.png");
  try {
    const res = await window.fetch("/record/sendStreamBlob", {
      method: "POST",
      cache: "no-cache",
      credentials: "same-origin",
      body: form,
    });
    if (res.status === 200) {
      return res.json();
    } else {
      return res.text().then((text) => {
        throw new Error(text);
      });
    }
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function startStream(data: any) {
  const res = await window.fetch("/record/startStream", {
    method: "POST",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function endStream() {
  const res = await window.fetch("/record/endStream", {
    method: "POST",
    cache: "no-cache",
    credentials: "same-origin",
  });
}
