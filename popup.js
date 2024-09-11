document.addEventListener('DOMContentLoaded', function() {
  const passwordEl = document.getElementById('password');
  const lengthEl = document.getElementById('length');
  const lengthValueEl = document.getElementById('length-value');
  const uppercaseEl = document.getElementById('uppercase');
  const lowercaseEl = document.getElementById('lowercase');
  const numbersEl = document.getElementById('numbers');
  const symbolsEl = document.getElementById('symbols');
  const copyEl = document.getElementById('copy');
  const refreshEl = document.getElementById('refresh');
  const copyMessageEl = document.getElementById('copy-message');
  const passwordsContainerEl = document.getElementById('passwords-container');

  const lengthSlider = document.getElementById('length');
  const lengthValue = document.getElementById('length-value');
  const countSlider = document.getElementById('count');
  const countValue = document.getElementById('count-value');

  // 确保长度滑动条的最小值为4，最大值为30
  lengthEl.min = "4";
  lengthEl.max = "30";

  // 修改这行，将默认值设置为 10
  countSlider.value = "50";
  countValue.textContent = "50";

  // 确保数量滑条的最小值为3，最大值为100
  countSlider.min = "3";
  countSlider.max = "100";

  function generatePasswords() {
    const length = Math.max(4, Math.min(lengthEl.value, 30)); // 确保长度在4到30之间
    const count = Math.max(3, Math.min(countSlider.value, 100)); // 确保数量在3到100之间
    const hasUppercase = uppercaseEl.checked;
    const hasLowercase = lowercaseEl.checked;
    const hasNumbers = numbersEl.checked;
    const hasSymbols = symbolsEl.checked;

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    passwordsContainerEl.innerHTML = ''; // 清空现有密码

    for (let i = 0; i < count; i++) {
      let password = '';
      let symbolCount = 0;
      const maxSymbols = Math.floor(length * 0.08); // 计算符号的最大数量

      for (let j = 0; j < length; j++) {
        let char = '';
        if (hasSymbols && symbolCount < maxSymbols && Math.random() < 0.08) {
          char = symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
          symbolCount++;
        } else {
          let availableChars = '';
          if (hasUppercase) availableChars += uppercaseChars;
          if (hasLowercase) availableChars += lowercaseChars;
          if (hasNumbers) availableChars += numberChars;
          if (availableChars === '') availableChars = lowercaseChars; // 默认使用小写字母
          char = availableChars.charAt(Math.floor(Math.random() * availableChars.length));
        }
        password += char;
      }

      // 确保密码包含至少一个选中的字符类型
      if (hasUppercase && !/[A-Z]/.test(password)) {
        password = replaceRandomChar(password, uppercaseChars);
      }
      if (hasLowercase && !/[a-z]/.test(password)) {
        password = replaceRandomChar(password, lowercaseChars);
      }
      if (hasNumbers && !/[0-9]/.test(password)) {
        password = replaceRandomChar(password, numberChars);
      }
      if (hasSymbols && symbolCount === 0) {
        password = replaceRandomChar(password, symbolChars);
      }

      // 创建密码元素并添加到容器中
      const passwordEl = document.createElement('div');
      passwordEl.classList.add('password-item');
      
      const passwordNumberEl = document.createElement('span');
      passwordNumberEl.classList.add('password-number');
      passwordNumberEl.textContent = `${i + 1}.`;
      
      const passwordTextEl = document.createElement('span');
      passwordTextEl.classList.add('password-text');
      passwordTextEl.textContent = password;
      
      const copyButton = document.createElement('button');
      copyButton.classList.add('copy-button');
      copyButton.innerHTML = `
        <svg class="copy-icon"><use xlink:href="#copy-icon"></use></svg>
        <svg class="check-icon"><use xlink:href="#check-icon"></use></svg>
      `;
      copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(password).then(() => {
          this.classList.add('copied');
          setTimeout(() => {
            this.classList.remove('copied');
          }, 3000);
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      });
      
      passwordEl.appendChild(passwordNumberEl);
      passwordEl.appendChild(passwordTextEl);
      passwordEl.appendChild(copyButton);
      passwordsContainerEl.appendChild(passwordEl);
    }
  }

  function updatePasswordLength() {
    lengthValueEl.textContent = lengthEl.value;
    generatePasswords();
  }

  copyEl.addEventListener('click', function() {
    const passwords = Array.from(passwordsContainerEl.children).map(el => el.querySelector('.password-text').textContent).join('\n');
    navigator.clipboard.writeText(passwords).then(() => {
      // 显示对勾图标
      this.querySelector('.copy-all-icon').style.display = 'none';
      this.querySelector('.check-all-icon').style.display = 'inline';
      
      // 3秒后变回原样
      setTimeout(() => {
        this.querySelector('.copy-all-icon').style.display = 'inline';
        this.querySelector('.check-all-icon').style.display = 'none';
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });

  refreshEl.addEventListener('click', generatePasswords);

  lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = this.value;
    generatePasswords();
  });

  countSlider.addEventListener('input', function() {
    countValue.textContent = this.value;
    generatePasswords();
  });

  generatePasswords();

  const exportEl = document.getElementById('export');

  function exportPasswords() {
    const passwords = Array.from(passwordsContainerEl.children).map(el => el.querySelector('.password-text').textContent).join('\n');
    const blob = new Blob([passwords], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  exportEl.addEventListener('click', exportPasswords);

  // 为每个 checkbox 添加事件监听器
  uppercaseEl.addEventListener('change', generatePasswords);
  lowercaseEl.addEventListener('change', generatePasswords);
  numbersEl.addEventListener('change', generatePasswords);
  symbolsEl.addEventListener('change', generatePasswords);
});

function replaceRandomChar(str, chars) {
  const index = Math.floor(Math.random() * str.length);
  const newChar = chars.charAt(Math.floor(Math.random() * chars.length));
  return str.substring(0, index) + newChar + str.substring(index + 1);
}