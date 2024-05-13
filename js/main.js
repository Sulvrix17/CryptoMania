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
    var playfair_text = document.getElementById("playfair-text").value.trim();
    var playfair_key = document.getElementById("playfair-key").value.trim();

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
    var playfair_text = document.getElementById("playfair-text").value.trim();
    var playfair_key = document.getElementById("playfair-key").value.trim();

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
  ////////////////////////////////////////////////////////
  let Key1;
  let Key2;
  let S0 = [
    ["01", "00", "11", "10"],
    ["11", "10", "01", "00"],
    ["00", "10", "01", "11"],
    ["11", "01", "11", "10"],
  ];

  function P4(s) {
    let temp = [];
    temp[0] = s[0];
    temp[1] = s[1];
    temp[2] = s[2];
    temp[3] = s[3];

    s = temp[1] + temp[3] + temp[2] + temp[0];
    return s;
  }

  let S1 = [
    ["00", "01", "10", "11"],
    ["10", "00", "01", "11"],
    ["11", "00", "01", "00"],
    ["10", "01", "00", "11"],
  ];

  function LeftShift(s) {
    let p = "";
    for (let i = 1; i < s.length; i++) {
      p += s[i];
    }
    p += s[0];
    return p;
  }

  function IP(s) {
    let temp = [];
    temp[0] = s[0];
    temp[1] = s[1];
    temp[2] = s[2];
    temp[3] = s[3];
    temp[4] = s[4];
    temp[5] = s[5];
    temp[6] = s[6];
    temp[7] = s[7];

    s = temp[1] + temp[5] + temp[2] + temp[0] + temp[3] + temp[7] + temp[4] + temp[6];
    return s;
  }

  function InverseIP(s) {
    let temp = [];
    temp[0] = s[0];
    temp[1] = s[1];
    temp[2] = s[2];
    temp[3] = s[3];
    temp[4] = s[4];
    temp[5] = s[5];
    temp[6] = s[6];
    temp[7] = s[7];

    s = temp[3] + temp[0] + temp[2] + temp[4] + temp[6] + temp[1] + temp[7] + temp[5];
    return s;
  }

  function EP(s) {
    let p = "aaaaaaaa";
    let temp = [];
    temp[0] = s[0];
    temp[1] = s[1];
    temp[2] = s[2];
    temp[3] = s[3];

    p = temp[3] + temp[0] + temp[1] + temp[2] + temp[1] + temp[2] + temp[3] + temp[0];
    return p;
  }

  function P8(s) {
    let temp = [];
    temp[0] = s[0];
    temp[1] = s[1];
    temp[2] = s[2];
    temp[3] = s[3];
    temp[4] = s[4];
    temp[5] = s[5];
    temp[6] = s[6];
    temp[7] = s[7];
    temp[8] = s[8];
    temp[9] = s[9];

    s = temp[5] + temp[2] + temp[6] + temp[3] + temp[7] + temp[4] + temp[9] + temp[8];
    s = s.substring(0, 8);
    return s;
  }

  function XOR(s, k) {
    let p = "";
    for (let i = 0; i < s.length; i++) {
      p += s[i] != k[i] ? "1" : "0";
    }

    return p;
  }

  function P10(s) {
    let temp = [];
    temp[0] = s[0];
    temp[1] = s[1];
    temp[2] = s[2];
    temp[3] = s[3];
    temp[4] = s[4];
    temp[5] = s[5];
    temp[6] = s[6];
    temp[7] = s[7];
    temp[8] = s[8];
    temp[9] = s[9];

    s = temp[2] + temp[4] + temp[1] + temp[6] + temp[3] + temp[9] + temp[0] + temp[8] + temp[6] + temp[5];
    return s;
  }

  function CalRow(s) {
    let row;
    let first, second, third, fourth;
    let firstbit, secondbit, thirdbit, fourthbit;
    first = s[0];
    second = s[1];
    third = s[2];
    fourth = s[3];
    firstbit = parseInt(first);
    secondbit = parseInt(second);
    thirdbit = parseInt(third);
    fourthbit = parseInt(fourth);
    if (secondbit == 1) secondbit = 2;
    if (firstbit == 1) firstbit = 2;
    row = firstbit + fourthbit;
    return row;
  }

  function CalCol(s) {
    let col;
    let first, second, third, fourth;
    let firstbit, secondbit, thirdbit, fourthbit;
    first = s[0];
    second = s[1];
    third = s[2];
    fourth = s[3];
    firstbit = parseInt(first);
    secondbit = parseInt(second);
    thirdbit = parseInt(third);
    fourthbit = parseInt(fourth);
    if (secondbit == 1) secondbit = 2;
    if (firstbit == 1) firstbit = 2;
    col = secondbit + thirdbit;
    return col;
  }

  function FirstRound(plaintext, Key) {
    Key = P10(Key);
    let firstHalf = Key.substring(0, Key.length / 2);
    let secondHalf = Key.substring(Key.length / 2);
    firstHalf = LeftShift(firstHalf);
    secondHalf = LeftShift(secondHalf);
    Key = firstHalf + secondHalf;
    Key = P8(Key);
    Key1 = Key;
    firstHalf = LeftShift(firstHalf);
    firstHalf = LeftShift(firstHalf);
    secondHalf = LeftShift(secondHalf);
    secondHalf = LeftShift(secondHalf);
    Key = firstHalf + secondHalf;
    Key = P8(Key);
    Key2 = Key;
    plaintext = IP(plaintext);
    let leftHalfAfterIP;
    let rightHalfAfterIP;
    leftHalfAfterIP = plaintext.substring(0, plaintext.length / 2);
    rightHalfAfterIP = plaintext.substring(plaintext.length / 2);
    secondHalf = plaintext.substring(plaintext.length / 2);
    secondHalf = EP(secondHalf);
    plaintext = secondHalf;
    plaintext = XOR(plaintext, Key1);
    secondHalf = plaintext.substring(plaintext.length / 2);
    firstHalf = plaintext.substring(0, plaintext.length / 2);
    let row, col;
    row = CalRow(firstHalf);
    col = CalCol(firstHalf);
    plaintext = plaintext.substring(0, 4);
    plaintext = S0[row][col];
    row = CalRow(secondHalf);
    col = CalCol(secondHalf);
    plaintext = plaintext + S1[row][col];
    plaintext = P4(plaintext);
    plaintext = XOR(plaintext, leftHalfAfterIP);
    plaintext = plaintext + rightHalfAfterIP;
    return plaintext;
  }

  function DecryptFirstRound(plaintext, Key) {
    Key = P10(Key);
    let firstHalf = Key.substring(0, Key.length / 2);
    let secondHalf = Key.substring(Key.length / 2);
    firstHalf = LeftShift(firstHalf);
    secondHalf = LeftShift(secondHalf);
    Key = firstHalf + secondHalf;
    Key = P8(Key);
    Key1 = Key;
    firstHalf = LeftShift(firstHalf);
    firstHalf = LeftShift(firstHalf);
    secondHalf = LeftShift(secondHalf);
    secondHalf = LeftShift(secondHalf);
    Key = firstHalf + secondHalf;
    Key = P8(Key);
    Key2 = Key;
    plaintext = IP(plaintext);
    let leftHalfAfterIP;
    let rightHalfAfterIP;
    leftHalfAfterIP = plaintext.substring(0, plaintext.length / 2);
    rightHalfAfterIP = plaintext.substring(plaintext.length / 2);
    secondHalf = plaintext.substring(plaintext.length / 2);
    secondHalf = EP(secondHalf);
    plaintext = secondHalf;
    plaintext = XOR(plaintext, Key2);
    secondHalf = plaintext.substring(plaintext.length / 2);
    firstHalf = plaintext.substring(0, plaintext.length / 2);
    let row, col;
    row = CalRow(firstHalf);
    col = CalCol(firstHalf);
    plaintext = plaintext.substring(0, 4);
    plaintext = S0[row][col];
    row = CalRow(secondHalf);
    col = CalCol(secondHalf);
    plaintext = plaintext + S1[row][col];
    plaintext = P4(plaintext);
    plaintext = XOR(plaintext, leftHalfAfterIP);
    plaintext = plaintext + rightHalfAfterIP;
    return plaintext;
  }

  function DecryptSecondRound(plaintext, Key) {
    let secondHalf, firstHalf;
    let leftHalfAfterIP;
    let rightHalfAfterIP;
    leftHalfAfterIP = plaintext.substring(0, plaintext.length / 2);
    rightHalfAfterIP = plaintext.substring(plaintext.length / 2);
    secondHalf = plaintext.substring(plaintext.length / 2);
    secondHalf = EP(secondHalf);
    plaintext = secondHalf;
    plaintext = XOR(plaintext, Key1);
    secondHalf = plaintext.substring(plaintext.length / 2);
    firstHalf = plaintext.substring(0, plaintext.length / 2);
    let row, col;
    row = CalRow(firstHalf);
    col = CalCol(firstHalf);
    plaintext = plaintext.substring(0, 4);
    plaintext = S0[row][col];
    row = CalRow(secondHalf);
    col = CalCol(secondHalf);
    plaintext = plaintext + S1[row][col];
    plaintext = P4(plaintext);
    plaintext = XOR(plaintext, leftHalfAfterIP);
    plaintext = plaintext + rightHalfAfterIP;
    plaintext = InverseIP(plaintext);
    return plaintext;
  }

  function SecondRound(plaintext, Key) {
    let secondHalf, firstHalf;
    let leftHalfAfterIP;
    let rightHalfAfterIP;
    leftHalfAfterIP = plaintext.substring(0, plaintext.length / 2);
    rightHalfAfterIP = plaintext.substring(plaintext.length / 2);
    secondHalf = plaintext.substring(plaintext.length / 2);
    secondHalf = EP(secondHalf);
    plaintext = secondHalf;
    plaintext = XOR(plaintext, Key2);
    secondHalf = plaintext.substring(plaintext.length / 2);
    firstHalf = plaintext.substring(0, plaintext.length / 2);
    let row, col;
    row = CalRow(firstHalf);
    col = CalCol(firstHalf);
    plaintext = plaintext.substring(0, 4);
    plaintext = S0[row][col];
    row = CalRow(secondHalf);
    col = CalCol(secondHalf);
    plaintext = plaintext + S1[row][col];
    plaintext = P4(plaintext);
    plaintext = XOR(plaintext, leftHalfAfterIP);
    plaintext = plaintext + rightHalfAfterIP;
    plaintext = InverseIP(plaintext);
    return plaintext;
  }

  function Flip(s) {
    let newS = "";
    let firstHalf, secondHalf;
    secondHalf = s.substring(s.length / 2);
    firstHalf = s.substring(0, s.length / 2);
    newS = secondHalf + firstHalf;
    return newS;
  }
  ////////////////////////////////
  document.getElementById("des-encrypt").onclick = function () {
    let plaintext = document.getElementById("des-text").value;
    let Key = document.getElementById("des-key").value;
    ////////////////
    if (Key.length == 10) {
      for (let i = 0; i < 10; i++) {
        if (Key[i] != "0" && Key[i] != "1") {
          console.log("Error");
          break;
        }
      }
    } else {
      console.log("Error");
    }

    if (plaintext.length == 8) {
      for (let i = 0; i < 8; i++) {
        if (plaintext[i] != "0" && plaintext[i] != "1") {
          console.log("error");
          break;
        }
      }
    } else {
      console.log("error");
    }

    ///////////////
    let result;
    result = FirstRound(plaintext, Key);
    result = Flip(result);
    result = SecondRound(result, Key);
    document.getElementById("des-result").value = result;
  };

  document.getElementById("des-decrypt").onclick = function () {
    let ciphertext = document.getElementById("des-text").value;
    let Key = document.getElementById("des-key").value;
    //////////////////
    if (Key.length == 10) {
      for (let i = 0; i < 10; i++) {
        if (Key[i] != "0" && Key[i] != "1") {
          console.log("Error");
          break;
        }
      }
    } else {
      console.log("Error");
    }

    if (ciphertext.length == 8) {
      for (let i = 0; i < 8; i++) {
        if (ciphertext[i] != "0" && ciphertext[i] != "1") {
          console.log("error");
          break;
        }
      }
    } else {
      console.log("error");
    }
    /////////////////
    let result;
    result = DecryptFirstRound(ciphertext, Key);
    result = Flip(result);
    result = DecryptSecondRound(result, Key);
    document.getElementById("des-result").value = result;
  };
}
