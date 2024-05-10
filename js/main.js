{
  //                             CAESAR ENCRYPTION & DECRYPTION
  function caesar(message, shift) {
    let result = "";

    for (let i = 0; i < message.length; i++) {
      let char = message[i];

      if (char.match(/[a-z]/i)) {
        const code = message.charCodeAt(i);

        if (code >= 65 && code <= 90) {
          char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
      }

      result += char;
    }

    return result;
  }
  /////////////////////////////////////////////////////////
  document.getElementById("caesar-encrypt").onclick = function () {
    var caesar_text = document.getElementById("caesar-text").value.trim();
    var caesar_key = parseInt(document.getElementById("caesar-key").value.trim());

    caesar_result = caesar(caesar_text, caesar_key);

    document.getElementById("caesar-result").value = caesar_result;
  };

  document.getElementById("caesar-decrypt").onclick = function () {
    var caesar_text = document.getElementById("caesar-text").value.trim();
    var caesar_key = 26 - parseInt(document.getElementById("caesar-key").value.trim());

    caesar_result = caesar(caesar_text, caesar_key);

    document.getElementById("caesar-result").value = caesar_result;
  };
}

{
  //                             AUTOKEY ENCRYPTION
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function autokeyEncryption(msg, key) {
    const len = msg.length;

    // generating the keystream
    let newKey = key + msg;
    newKey = newKey.substring(0, newKey.length - key.length);
    let encryptMsg = "";

    // applying encryption algorithm
    for (let x = 0; x < len; x++) {
      const first = alphabet.indexOf(msg[x]);
      const second = alphabet.indexOf(newKey[x]);
      const total = (first + second) % 26;
      encryptMsg += alphabet[total];
    }
    return encryptMsg;
  }
  //                             AUTOKEY DECRYPTION
  function autokeyDecryption(msg, key) {
    let currentKey = key;
    let decryptMsg = "";

    // applying decryption algorithm
    for (let x = 0; x < msg.length; x++) {
      const get1 = alphabet.indexOf(msg[x]);
      const get2 = alphabet.indexOf(currentKey[x]);
      let total = (get1 - get2) % 26;
      total = total < 0 ? total + 26 : total;
      decryptMsg += alphabet[total];
      currentKey += alphabet[total];
    }
    return decryptMsg;
  }
  //////////////////////////////////////////////////////////
  document.getElementById("autokey-encrypt").onclick = function () {
    var autokey_text = document.getElementById("autokey-text").value.toUpperCase().trim();
    var autokey_key = document.getElementById("autokey-key").value.toUpperCase().trim();

    autokey_result = autokeyEncryption(autokey_text, autokey_key);

    document.getElementById("autokey-result").value = autokey_result;
  };

  document.getElementById("autokey-decrypt").onclick = function () {
    var autokey_text = document.getElementById("autokey-text").value.toUpperCase().trim();
    var autokey_key = document.getElementById("autokey-key").value.toUpperCase().trim();

    autokey_result = autokeyDecryption(autokey_text, autokey_key);

    document.getElementById("autokey-result").value = autokey_result;
  };
}

{
  //                             PLAYFAIR ENCRYPTION

  // Function to generate the 5x5 key square
  function generateKeyTable(key, ks, keyT) {
    let i,
      j,
      k,
      flag = 0;

    // a 26 character hashmap
    // to store count of the alphabet
    let dicty = new Array(26).fill(0);
    for (i = 0; i < ks; i++) {
      let r = key[i].charCodeAt(0) - 97;

      if (key[i] != "j") {
        dicty[r] = 2;
      }
    }

    dicty["j".charCodeAt(0) - 97] = 1;
    i = 0;
    j = 0;

    for (k = 0; k < ks; k++) {
      let r = key[k].charCodeAt(0) - 97;
      if (dicty[r] == 2) {
        dicty[r] -= 1;
        keyT[i][j] = key[k];
        j++;
        if (j == 5) {
          i++;
          j = 0;
        }
      }
    }

    for (k = 0; k < 26; k++) {
      if (dicty[k] == 0) {
        keyT[i][j] = String.fromCharCode(k + 97);
        j++;
        if (j == 5) {
          i++;
          j = 0;
        }
      }
    }
    return keyT;
  }

  // Function to search for the characters of a digraph
  // in the key square and return their position
  function search(keyT, a, b, arr) {
    let i, j;

    if (a == "j") a = "i";
    else if (b == "j") b = "i";

    for (i = 0; i < 5; i++) {
      for (j = 0; j < 5; j++) {
        if (keyT[i][j] == a) {
          arr[0] = i;
          arr[1] = j;
        } else if (keyT[i][j] == b) {
          arr[2] = i;
          arr[3] = j;
        }
      }
    }
    return arr;
  }

  // Function to find the modulus with 5
  function mod5(a) {
    return a % 5;
  }

  // Function to make the plain text length to be even
  function prepare(str, ptrs) {
    if (ptrs % 2 != 0) {
      str += "z";
    }

    return [str, ptrs];
  }

  // Function for performing the encryption
  function encrypt(str, keyT, ps) {
    let i;
    let a = new Array(4).fill(0);
    let newstr = new Array(ps);

    for (i = 0; i < ps; i += 2) {
      let brr = search(keyT, str[i], str[i + 1], a);
      let k1 = brr[0];
      let k2 = brr[1];
      let k3 = brr[2];
      let k4 = brr[3];
      if (k1 == k3) {
        newstr[i] = keyT[k1][(k2 + 1) % 5];
        newstr[i + 1] = keyT[k1][(k4 + 1) % 5];
      } else if (k2 == k4) {
        newstr[i] = keyT[(k1 + 1) % 5][k2];
        newstr[i + 1] = keyT[(k3 + 1) % 5][k2];
      } else {
        newstr[i] = keyT[k1][k4];
        newstr[i + 1] = keyT[k3][k2];
      }
    }
    let res = "";

    for (let i = 0; i < newstr.length; i++) {
      res += newstr[i];
    }
    return res;
  }

  // Function to encrypt using Playfair Cipher
  function playfairEncryption(str, key) {
    let ps, ks;
    let keyT = new Array(5);

    for (let i = 0; i < 5; i++) {
      keyT[i] = new Array(5);
    }
    str = str.trim();
    key = key.trim();
    str = str.toLowerCase();

    key = key.toLowerCase();
    ps = str.length;
    ks = key.length;
    [str, ps] = prepare(str, ps);

    let kt = generateKeyTable(key, ks, keyT);
    return encrypt(str, kt, ps);
  }

  document.getElementById("playfair-encrypt").onclick = function () {
    var playfair_text = document.getElementById("playfair-text").value;
    var playfair_key = document.getElementById("playfair-key").value;

    playfair_result = playfairEncryption(playfair_text, playfair_key);

    document.getElementById("playfair-result").value = playfair_result;
  };
  //                             PLAYFAIR DECRYPTION
  function toLowerCase(plain) {
    // Convert all the characters of a string to lowercase
    return plain.toLowerCase();
  }

  function removeSpaces(plain) {
    // Remove all spaces in a string
    // can be extended to remove punctuation
    return plain.split(" ").join("");
  }

  function generateKeyTable(key) {
    // generates the 5x5 key square
    var keyT = new Array(5).fill(null).map(() => new Array(5).fill(""));
    var dicty = {};
    for (var i = 0; i < 26; i++) {
      dicty[String.fromCharCode(i + 97)] = 0;
    }

    for (var i = 0; i < key.length; i++) {
      if (key[i] != "j") {
        dicty[key[i]] = 2;
      }
    }
    dicty["j"] = 1;

    var i = 0,
      j = 0,
      k = 0;
    while (k < key.length) {
      if (dicty[key[k]] == 2) {
        dicty[key[k]] -= 1;
        keyT[i][j] = key[k];
        j += 1;
        if (j == 5) {
          i += 1;
          j = 0;
        }
      }
      k += 1;
    }

    for (var k in dicty) {
      if (dicty[k] == 0) {
        keyT[i][j] = k;
        j += 1;
        if (j == 5) {
          i += 1;
          j = 0;
        }
      }
    }

    return keyT;
  }

  function search(keyT, a, b) {
    // Search for the characters of a digraph in the key square and return their position
    var arr = [0, 0, 0, 0];

    if (a == "j") {
      a = "i";
    } else if (b == "j") {
      b = "i";
    }

    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        if (keyT[i][j] == a) {
          arr[0] = i;
          arr[1] = j;
        } else if (keyT[i][j] == b) {
          arr[2] = i;
          arr[3] = j;
        }
      }
    }

    return arr;
  }

  function mod5(a) {
    // Function to find the modulus with 5
    if (a < 0) {
      a += 5;
    }
    return a % 5;
  }
  function decrypt(str, keyT) {
    // Function to decrypt
    var ps = str.length;
    var i = 0;
    while (i < ps) {
      var a = search(keyT, str[i], str[i + 1]);
      if (a[0] == a[2]) {
        str = str.slice(0, i) + keyT[a[0]][mod5(a[1] - 1)] + keyT[a[0]][mod5(a[3] - 1)] + str.slice(i + 2);
      } else if (a[1] == a[3]) {
        str = str.slice(0, i) + keyT[mod5(a[0] - 1)][a[1]] + keyT[mod5(a[2] - 1)][a[1]] + str.slice(i + 2);
      } else {
        str = str.slice(0, i) + keyT[a[0]][a[3]] + keyT[a[2]][a[1]] + str.slice(i + 2);
      }
      i += 2;
    }
    return str;
  }

  function playfairDecryption(str, key) {
    // Function to call decrypt
    var ks = key.length;
    key = removeSpaces(toLowerCase(key));
    str = removeSpaces(toLowerCase(str));
    var keyT = generateKeyTable(key);
    return decrypt(str, keyT);
  }

  document.getElementById("playfair-decrypt").onclick = function () {
    var playfair_text = document.getElementById("playfair-text").value;
    var playfair_key = document.getElementById("playfair-key").value;

    playfair_result = playfairDecryption(playfair_text, playfair_key);

    document.getElementById("playfair-result").value = playfair_result;
  };
}

// {
//   function RSA(p, q, msg, e) {
//     // const bigint = require("big-integer");
//     function gcd(a, h) {
//       /*
//        * This function returns the gcd or greatest common
//        * divisor
//        */
//       let temp;
//       while (true) {
//         temp = a % h;
//         if (temp === 0) return h;
//         a = h;
//         h = temp;
//       }
//     }

//     function modInverse(e, phi) {
//       let a = phi;
//       let b = e;
//       let x = 0;
//       let y = 1;

//       while (b > 0) {
//         let q = Math.floor(a / b);
//         let r = a % b;
//         let m = x - q * y;
//         a = b;
//         b = r;
//         x = y;
//         y = m;
//       }

//       if (a !== 1) return null;

//       return ((x % phi) + phi) % phi;
//     }

//     function modPow(base, exponent, modulus) {
//       let result = 1;
//       base = base % modulus;

//       while (exponent > 0) {
//         if (exponent & (1 === 1)) {
//           result = (result * base) % modulus;
//         }
//         base = (base * base) % modulus;
//         exponent = exponent >> 1;
//       }

//       return result;
//     }

//     // let p = document.getElementById("rsa-p").value;
//     // let q = document.getElementById("rsa-q").value;

//     // Stores the first part of public key:
//     let n = p * q;

//     // Finding the other part of public key.
//     // let e stands for encrypt
//     // let e = document.getElementById("rsa-e").value;
//     let phi = (p - 1) * (q - 1);
//     while (e < phi) {
//       /*
//        * e must be co-prime to phi and
//        * smaller than phi.
//        */
//       if (gcd(e, phi) === 1) break;
//       else e++;
//     }
//     // let k = 2; // A constant value
//     // let d = (1 + k * phi) / e;
//     let d = modInverse(e, phi); // Compute modular inverse

//     // Message to be encrypted
//     // let msg = document.getElementById("rsa-m").value;

//     console.log("Message data = " + msg);

//     // Encryption c = (msg ^ e) % n
//     // let c = Math.pow(msg, e) % n;
//     let c = modPow(msg, e, n);
//     console.log("Encrypted data = " + c);

//     // let m = (c ^ d) % n;
//     // let m = Math.pow(c, d) % n;
//     let m = modPow(c, d, n);
//     console.log("Original Message Sent = " + m);

//     return (result = [c, m]);
//   }
//   /////////////
//   document.getElementById("rsa-encrypt").onclick = function () {
//     let p = document.getElementById("rsa-p").value;
//     let q = document.getElementById("rsa-q").value;
//     let e = document.getElementById("rsa-e").value;
//     let m = document.getElementById("rsa-m").value;
//     let _result = RSA(p, q, m, e);
//     document.getElementById("rsa-result").value = _result[0];
//   };
//   document.getElementById("rsa-decrypt").onclick = function () {
//     let p = document.getElementById("rsa-p").value;
//     let q = document.getElementById("rsa-q").value;
//     let e = document.getElementById("rsa-e").value;
//     let m = document.getElementById("rsa-m").value;
//     let _result = RSA(p, q, m, e);
//     document.getElementById("rsa-result").value = _result[1];
//   };
// }
{
  // rsaEncrypt() {
  //   let p = document.getElementById("rsa-p").value;
  //   let q = document.getElementById("rsa-q").value;
  //   let e = document.getElementById("rsa-e").value;
  //   let m = document.getElementById("rsa-m").value;
  //   generateKeys(p, q, e);
  //   cipherText = encrypt(m, publicKey);
  // }
  // rsaDecrypt() {
  //   let p = document.getElementById("rsa-p").value;
  //   let q = document.getElementById("rsa-q").value;
  //   let e = document.getElementById("rsa-e").value;
  //   let m = document.getElementById("rsa-m").value;
  //   RSA.generateKeys(p, q, e);
  //   cipherText = encrypt(m, privateKey);
  // }
}
document.getElementById("rsa-encrypt").onclick = function () {
  function modularExponentiation(base, exponent, modulus) {
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
      if (exponent % 2 === 1)
        // If exponent is odd, multiply base with result
        result = (result * base) % modulus;
      exponent = Math.floor(exponent / 2); // Divide exponent by 2
      base = (base * base) % modulus;
    }
    return result;
  }

  function rsaEncrypt(p, q, e, plaintext) {
    const N = p * q;
    const plaintextNumbers = [...plaintext].map((char) => char.charCodeAt(0)); // Convert plaintext to array of ASCII values
    const encrypted = plaintextNumbers.map((num) => {
      if (num >= N) throw new Error("Plaintext character ASCII value cannot be greater than modulus N.");
      return modularExponentiation(num, e, N); // Encrypt each number
    });
    return encrypted;
  }

  // Example usage:
  const p = parseInt(prompt("Enter a small prime number p:"));
  const q = parseInt(prompt("Enter a small prime number q:"));
  const e = parseInt(prompt("Enter public exponent e:"));
  const message = prompt("Enter a plaintext message:");

  try {
    const encrypted = rsaEncrypt(p, q, e, message);
    console.log("Encrypted message:", encrypted.join(" "));
  } catch (error) {
    console.error(error);
  }
};
// document.getElementById("rsa-decrypt").onclick = function () {
//   // RSA = new RSA();
//   let _result = RSA.rsaDecrypt();
//   document.getElementById("rsa-result").value = _result[1];
// };
