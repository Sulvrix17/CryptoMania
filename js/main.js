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

{
  function RSA(p, q, msg, e) {
    function gcd(a, h) {
      /*
       * This function returns the gcd or greatest common
       * divisor
       */
      let temp;
      while (true) {
        temp = a % h;
        if (temp === 0) return h;
        a = h;
        h = temp;
      }
    }

    function modInverse(e, phi) {
      let a = phi;
      let b = e;
      let x = 0;
      let y = 1;

      while (b > 0) {
        let q = Math.floor(a / b);
        let r = a % b;
        let m = x - q * y;
        a = b;
        b = r;
        x = y;
        y = m;
      }

      if (a !== 1) return null;

      return ((x % phi) + phi) % phi;
    }

    function modPow(base, exponent, modulus) {
      let result = 1;
      base = base % modulus;

      while (exponent > 0) {
        if (exponent & (1 === 1)) {
          result = (result * base) % modulus;
        }
        base = (base * base) % modulus;
        exponent = exponent >> 1;
      }

      return result;
    }

    // Stores the first part of public key:
    let n = p * q;

    // Finding the other part of public key.
    // let e stands for encrypt
    let phi = (p - 1) * (q - 1);
    while (e < phi) {
      /*
       * e must be co-prime to phi and
       * smaller than phi.
       */
      if (gcd(e, phi) === 1) break;
      else e++;
    }
    let d = modInverse(e, phi); // Compute modular inverse

    let c = modPow(msg, e, n);

    let m = modPow(c, d, n);

    return (result = [c, m, msg]);
  }
  /////////////
  document.getElementById("rsa-encrypt").onclick = function () {
    p = document.getElementById("rsa-p").value;
    q = document.getElementById("rsa-q").value;
    e = document.getElementById("rsa-e").value;
    m = document.getElementById("rsa-m").value;
    if (p === "" || q === "" || e === "" || m === "") {
      document.getElementById("rsa-result").value = "";
    } else {
      let _result = RSA(p, q, m, e);
      document.getElementById("rsa-result").value = _result[0];
    }
  };
  document.getElementById("rsa-decrypt").onclick = function () {
    let p = document.getElementById("rsa-p").value;
    let q = document.getElementById("rsa-q").value;
    let e = document.getElementById("rsa-e").value;
    let c = document.getElementById("rsa-m").value; // Use 'c' for ciphertext input

    if (p === "" || q === "" || e === "" || c === "") {
      document.getElementById("rsa-result").value = "";
    } else {
      let _result = RSA(p, q, c, e); // Pass 'c' as the message for decryption
      document.getElementById("rsa-result").value = _result[1]; // Display the decrypted message
    }
  };
}

{
  function des(key, plaintext) {
    // int key[]= {0,0,1,0,0,1,0,1,1,1};
    // const key = [1, 0, 1, 0, 0, 0, 0, 0, 1, 0]; // extra example for checking purpose
    const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
    const P8 = [6, 3, 7, 4, 8, 5, 10, 9];

    const key1 = new Array(8).fill(0);
    const key2 = new Array(8).fill(0);

    const IP = [2, 6, 3, 1, 4, 8, 5, 7];
    const EP = [4, 1, 2, 3, 2, 3, 4, 1];
    const P4 = [2, 4, 3, 1];
    const IP_inv = [4, 1, 3, 5, 7, 2, 8, 6];

    const S0 = [
      [1, 0, 3, 2],
      [3, 2, 1, 0],
      [0, 2, 1, 3],
      [3, 1, 3, 2],
    ];
    const S1 = [
      [0, 1, 2, 3],
      [2, 0, 1, 3],
      [3, 0, 1, 0],
      [2, 1, 0, 3],
    ];

    // this function basically generates the key(key1 and key2) using P10 and P8 with (1 and 2)left shifts
    const key_generation = () => {
      const key_ = new Array(10);

      for (let i = 0; i < 10; i++) {
        key_[i] = key[P10[i] - 1];
      }

      const Ls = new Array(5);
      const Rs = new Array(5);

      for (let i = 0; i < 5; i++) {
        Ls[i] = key_[i];
        Rs[i] = key_[i + 5];
      }

      const Ls_1 = shift(Ls, 1);
      const Rs_1 = shift(Rs, 1);

      for (let i = 0; i < 5; i++) {
        key_[i] = Ls_1[i];
        key_[i + 5] = Rs_1[i];
      }

      for (let i = 0; i < 8; i++) {
        key1[i] = key_[P8[i] - 1];
      }

      const Ls_2 = shift(Ls, 2);
      const Rs_2 = shift(Rs, 2);

      for (let i = 0; i < 5; i++) {
        key_[i] = Ls_2[i];
        key_[i + 5] = Rs_2[i];
      }

      for (let i = 0; i < 8; i++) {
        key2[i] = key_[P8[i] - 1];
      }

      console.log("Your Key-1 :");
      console.log(key1.join(" "));
      console.log("Your Key-2 :");
      console.log(key2.join(" "));
    };

    // this function is use full for shifting(circular) the array n position towards left
    const shift = (ar, n) => {
      while (n > 0) {
        const temp = ar[0];
        for (let i = 0; i < ar.length - 1; i++) {
          ar[i] = ar[i + 1];
        }
        ar[ar.length - 1] = temp;
        n--;
      }
      return ar;
    };

    // this is main encryption function takes plain text as input uses another functions and returns the array of cipher text
    const encryption = (plaintext) => {
      const arr = new Array(8);

      for (let i = 0; i < 8; i++) {
        arr[i] = plaintext[IP[i] - 1];
      }
      const arr1 = function_(arr, key1);

      const after_swap = swap(arr1, arr1.length / 2);

      const arr2 = function_(after_swap, key2);

      const ciphertext = new Array(8);

      for (let i = 0; i < 8; i++) {
        ciphertext[i] = arr2[IP_inv[i] - 1];
      }

      return ciphertext;
    };

    // decimal to binary string 0-3
    const binary_ = (val) => {
      if (val === 0) return "00";
      else if (val === 1) return "01";
      else if (val === 2) return "10";
      else return "11";
    };

    // this function is doing core things like expansion then xor with desired key then S0 and S1 substitution P4 permutation and again xor we have used this function 2 times(key-1 and key-2) during encryption and 2 times(key-2 and key-1) during decryption
    const function_ = (ar, key_) => {
      const l = new Array(4);
      const r = new Array(4);

      for (let i = 0; i < 4; i++) {
        l[i] = ar[i];
        r[i] = ar[i + 4];
      }

      const ep = new Array(8);

      for (let i = 0; i < 8; i++) {
        ep[i] = r[EP[i] - 1];
      }

      for (let i = 0; i < 8; i++) {
        ar[i] = key_[i] ^ ep[i];
      }

      const l_1 = new Array(4);
      const r_1 = new Array(4);

      for (let i = 0; i < 4; i++) {
        l_1[i] = ar[i];
        r_1[i] = ar[i + 4];
      }

      let row, col, val;

      row = parseInt(`${l_1[0]}${l_1[3]}`, 2);
      col = parseInt(`${l_1[1]}${l_1[2]}`, 2);
      val = S0[row][col];
      const str_l = binary_(val);

      row = parseInt(`${r_1[0]}${r_1[3]}`, 2);
      col = parseInt(`${r_1[1]}${r_1[2]}`, 2);
      val = S1[row][col];
      const str_r = binary_(val);

      const r_ = new Array(4);
      for (let i = 0; i < 2; i++) {
        const c1 = str_l.charAt(i);
        const c2 = str_r.charAt(i);
        r_[i] = parseInt(c1, 10);
        r_[i + 2] = parseInt(c2, 10);
      }
      const r_p4 = new Array(4);
      for (let i = 0; i < 4; i++) {
        r_p4[i] = r_[P4[i] - 1];
      }

      for (let i = 0; i < 4; i++) {
        l[i] = l[i] ^ r_p4[i];
      }

      const output = new Array(8);
      for (let i = 0; i < 4; i++) {
        output[i] = l[i];
        output[i + 4] = r[i];
      }
      return output;
    };

    // this function swaps the nibble of size n(4)
    const swap = (array, n) => {
      const l = new Array(n);
      const r = new Array(n);

      for (let i = 0; i < n; i++) {
        l[i] = array[i];
        r[i] = array[i + n];
      }

      const output = new Array(2 * n);
      for (let i = 0; i < n; i++) {
        output[i] = r[i];
        output[i + n] = l[i];
      }

      return output;
    };

    // this is main decryption function
    // here we have used all previously defined function
    // it takes cipher text as input and returns the array of decrypted text
    const decryption = (ar) => {
      const arr = new Array(8);

      for (let i = 0; i < 8; i++) {
        arr[i] = ar[IP[i] - 1];
      }

      const arr1 = function_(arr, key2);

      const after_swap = swap(arr1, arr1.length / 2);

      const arr2 = function_(after_swap, key1);

      const decrypted = new Array(8);

      for (let i = 0; i < 8; i++) {
        decrypted[i] = arr2[IP_inv[i] - 1];
      }

      return decrypted;
    };

    key_generation(); // call to key generation function

    // int []plaintext= {1,0,1,0,0,1,0,1};
    // const plaintext = [1, 0, 0, 1, 0, 1, 1, 1]; // extra example for checking purpose

    console.log();
    console.log("Your plain Text is :");
    console.log(plaintext.join(" ")); // printing the plaintext

    const ciphertext = encryption(plaintext);

    console.log();
    console.log("Your cipher Text is :"); // printing the cipher text
    console.log(ciphertext.join(" "));

    const decrypted = decryption(ciphertext);

    console.log();
    console.log("Your decrypted Text is :"); // printing the decrypted text
    console.log(decrypted.join(" "));
    return (result = [ciphertext, decrypted]);
  }
}
{
  document.getElementById("des-encrypt").onclick = function () {
    let myInt_k = document.getElementById("des-key").value;
    let myFunc_k = (num_k) => Number(num_k);
    let intArr_k = Array.from(String(myInt_k), myFunc_k);

    let myInt_p = document.getElementById("des-text").value;
    let myFunc_p = (num_p) => Number(num_p);
    let intArr_p = Array.from(String(myInt_p), myFunc_p);

    let result = des(intArr_k, intArr_p);
    let digits = result[0];

    let _result = digits.join("");

    console.log(_result);
    document.getElementById("des-result").value = _result;
  };
  document.getElementById("des-decrypt").onclick = function () {
    let myInt_k = document.getElementById("des-key").value;
    let myFunc_k = (num_k) => Number(num_k);
    let intArr_k = Array.from(String(myInt_k), myFunc_k);

    let myInt_p = document.getElementById("des-text").value;
    let myFunc_p = (num_p) => Number(num_p);
    let intArr_p = Array.from(String(myInt_p), myFunc_p);

    let result = des(intArr_k, intArr_p);
    let digits = result[1];

    let _result = digits.join("");

    console.log(_result);
    document.getElementById("des-result").value = _result;
  };
}
