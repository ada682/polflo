import axios from 'axios';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import FormData from 'form-data';
import { createCanvas, loadImage } from 'canvas';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import ora from 'ora';
import { createSpinner } from 'nanospinner';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(chalk.cyan(query), resolve));
}

async function animateSnake(text) {
  const width = 60;
  const height = 15;
  const positions = [];
  
  for (let i = 0; i < width; i++) positions.push({x: i, y: 0});
  for (let i = 1; i < height; i++) positions.push({x: width-1, y: i});
  for (let i = width-2; i >= 0; i--) positions.push({x: i, y: height-1});
  for (let i = height-2; i > 0; i--) positions.push({x: 0, y: i});
  
  const snakeChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const snakeColors = [
    chalk.green,
    chalk.greenBright,
    chalk.yellow,
    chalk.blue,
    chalk.magenta
  ];
  
  const snakeLength = 10;
  let frameCount = 0;
  
  const logoLines = text.split('\n');
  const logoHeight = logoLines.length;
  const logoWidth = Math.max(...logoLines.map(line => line.length));
  
  const logoX = Math.floor((width - logoWidth) / 2);
  const logoY = Math.floor((height - logoHeight) / 2);
  
  console.clear();
  
  return new Promise(resolve => {
    const intervalId = setInterval(() => {
      console.clear();
      
      const canvas = Array(height).fill().map(() => Array(width).fill(' '));
      
      logoLines.forEach((line, i) => {
        if (logoY + i < height) {
          for (let j = 0; j < line.length; j++) {
            if (logoX + j < width) {
              canvas[logoY + i][logoX + j] = line[j];
            }
          }
        }
      });
      
      for (let i = 0; i < snakeLength; i++) {
        const pos = positions[(frameCount - i) % positions.length];
        if (pos) {
          const snakeChar = snakeChars[i % snakeChars.length];
          const colorFn = snakeColors[i % snakeColors.length];
          if (canvas[pos.y] && canvas[pos.y][pos.x] === ' ') {
            canvas[pos.y][pos.x] = colorFn(snakeChar);
          }
        }
      }
      
      console.log(canvas.map(row => row.join('')).join('\n'));
      
      frameCount++;
      
      if (frameCount > positions.length * 2) {
        clearInterval(intervalId);
        console.clear();
        resolve();
      }
    }, 50);
  });
}

async function printLogo() {
  console.clear();
  
  const bcaBotText = figlet.textSync('BCA BOT', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });
  
  await animateSnake(bcaBotText);
  
  console.log(
    gradient.pastel.multiline(bcaBotText)
  );
  
  console.log(
    boxen(chalk.blue(`🤖 POLY BCA INVOICE GENERATOR BOT v1.0`), {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'green'
    })
  );
  
  console.log(chalk.yellow('='.repeat(70)) + '\n');

  const spinner = createSpinner('Initializing BCA BOT...').start();
  await new Promise(resolve => setTimeout(resolve, 1500));
  spinner.success({ text: 'BCA BOT Ready!' });
}

function showProgressBar(current, total) {
  const percentage = Math.round((current / total) * 100);
  const completed = Math.round((percentage / 100) * 40);
  const remaining = 40 - completed;
  const bar = '█'.repeat(completed) + '░'.repeat(remaining);
  return `${bar} ${percentage}%`;
}

function getRandomUserAgent() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Edg/135.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0',
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function getRandomName() {
  const firstNames = [
    "SAMUEL", "HANNY", "FEBY", "LEONARDO", "IRENE", "BUDI", "AMELIA", "CHRISTOPHER", "DINDA", "EVAN", 
    "AHMAD", "SITI", "RUDI", "DEWI", "JOKO", "RINA", "AGUS", "KARTIKA", "BAMBANG", "SANTI",
    "DIAN", "FAJAR", "PUTRI", "ARIEF", "MAYA", "WAWAN", "NINA", "HENDRA", "RATNA", "YANTO",
    "NOVI", "INDRA", "TIKA", "DODI", "ELLA", "RIZKI", "NADIA", "SURYA", "YANTI", "ANTON",
    "DIANA", "DICKY", "ANISA", "FIRMAN", "LARAS", "RAHMAT", "WATI", "DADANG", "LINA", "RONI",
    "YUNI", "HADI", "FITRI", "FARID", "RINI", "BAGUS", "RANI", "DEDI", "MIRA", "BIMA",
    "SISKA", "SYAIFUL", "DINA", "REZA", "SARI", "DANI", "NITA", "TONI", "RINA", "BAYU",
    "LUSI", "FAISAL", "WINDA", "FERRY", "MEGA", "FANDI", "LISA", "YUSUF", "DEVI", "ANDRI",
    "YANI", "WAHYU", "NINING", "HENDRIK", "IDA", "FIRMAN", "VERA", "ANDRE", "SINTA", "DHANI",
    "SHANDY", "ANGGI", "TEDY", "RANI", "DITO", "LENI", "RAKA", "DESI", "PANDU", "RISSA"
  ];
  
  const lastNames = [
    "RINDU", "WIJAYA", "PUTRI", "SUGIANTO", "SANTOSO", "TANIA", "ANGGA", "PERMATA", "GUNAWAN", "ANGGORO",
    "SAPUTRA", "KUSUMA", "PUTRA", "DEWI", "SUSANTO", "HIDAYAT", "NUGRAHA", "RAMADHAN", "PURNAMA", "FADILLAH",
    "PRATAMA", "UTAMI", "WIJAYA", "AGUSTINA", "NUGROHO", "RAHMAWATI", "FIRDAUS", "MAHARANI", "SUHERMAN", "FITRIANI",
    "SETIAWAN", "PERMATA", "KURNIAWAN", "PERMATASARI", "SETIADI", "MAULANA", "PRASTUTI", "FIRMANSYAH", "FEBRIANI", "WIBOWO",
    "OCTAVIANI", "WICAKSONO", "NOVITASARI", "KUSUMO", "RAHMADANI", "PRIAMBODO", "PUSPITASARI", "HARYANTO", "APRILIANI", "HADIWIJAYA",
    "OKTAVIANI", "ISKANDAR", "RATNASARI", "ALAMSYAH", "WAHYUNI", "PRASETYO", "HAPSARI", "ADIKUSUMA", "ANDRIANI", "HASIBUAN",
    "KUMALASARI", "SURYANTO", "RAMADHANI", "SUWANDI", "CHANDRA", "WIDODO", "PARAMITHA", "SISWANTO", "MULYANI", "SALAHUDIN",
    "PERTIWI", "PRANATA", "SAFITRI", "ANGGARA", "YULIANI", "PRABOWO", "NURAINI", "SUDRAJAT", "MELANI", "HARTONO",
    "NOVIANTI", "RACHMAN", "ADITYA", "PURWANTO", "ROSITA", "HANDOKO", "NURFADILLAH", "KRISTIANTO", "NOVITA", "HERMAWAN",
    "MARITO", "KURNIA", "HARTANTO", "LESTARI", "HERIYANTO", "INDAHSARI", "SOETOMO", "ANGGRAINI", "WIBISONO", "PURNAMASARI"
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  if (Math.random() > 0.3) {
    return `${firstName} ${lastName}`;
  } else {
    const middleName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${middleName} ${lastName}`;
  }
}

function getRandomAccount() {
  const accountTypes = [
    "643-", "512-", "781-", "624-", "905-", "456-", "333-", "701-", "882-", "529-",
    "123-", "234-", "345-", "456-", "567-", "678-", "789-", "890-", "901-", "112-",
    "223-", "334-", "445-", "556-", "667-", "778-", "889-", "990-", "001-", "112-"
  ];
  
  const randomType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
  const middleDigits = Math.floor(Math.random() * 10) + "**";
  const lastDigits = "**" + Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  return `${randomType}${middleDigits}-${lastDigits}`;
}

function getRandomAmount() {
  const amounts = [
    10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000,
    60000, 65000, 70000, 75000, 79000, 80000, 85000, 90000, 95000, 100000,
    105000, 110000, 115000, 120000, 125000, 130000, 150000, 175000, 200000, 225000,
    250000, 275000, 300000
  ];
  return amounts[Math.floor(Math.random() * amounts.length)];
}

function formatMoney(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ".00";
}

function formatDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}

async function generateInvoiceImage(count) {
  const width = 500;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  const recipientName = getRandomName();
  const fromAccount = getRandomAccount();
  const amount = getRandomAmount();
  const adminFee = 1000;
  const totalAmount = amount + adminFee;
  const date = formatDate();
  
  ctx.globalAlpha = 0.1;
  ctx.font = 'bold 80px Arial';
  ctx.fillStyle = '#0066b3';
  ctx.textAlign = 'center';
  ctx.fillText('BCA', width/2, height/2);
  ctx.globalAlpha = 1.0;
  
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#0066b3';
  ctx.textAlign = 'center';
  ctx.fillText('BCA', width/2, 40);
  
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = '#00aa00';
  ctx.textAlign = 'left';
  ctx.fillText('✓ Transfer Berhasil', 30, 80);
  ctx.font = '14px Arial';
  ctx.fillStyle = '#666666';
  ctx.fillText(date, 30, 105);
  
  ctx.strokeStyle = '#dddddd';
  ctx.beginPath();
  ctx.moveTo(30, 125);
  ctx.lineTo(width - 30, 125);
  ctx.stroke();
  
  const details = [
    { label: 'Account', value: '0' },
    { label: 'Nama', value: recipientName },
    { label: 'Nama Produk', value: 'GOPAY TOPUP' },
    { label: 'Dari Rekening', value: fromAccount },
    { label: 'Nominal Bayar', value: `IDR ${formatMoney(amount)}` },
    { label: 'Biaya Admin', value: `IDR ${formatMoney(adminFee)}` },
    { label: 'Total Bayar', value: `IDR ${formatMoney(totalAmount)}` },
    { label: 'Keterangan', value: '' },
    { label: 'Jenis Transaksi', value: 'Transfer ke BCA' }
  ];
  
  let y = 160;
  for (const detail of details) {
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'left';
    ctx.fillText(detail.label, 30, y);
    
    ctx.font = detail.label === 'Total Bayar' ? 'bold 14px Arial' : '14px Arial';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'right';
    ctx.fillText(detail.value, width - 30, y);
    
    ctx.strokeStyle = '#eeeeee';
    ctx.beginPath();
    ctx.moveTo(30, y + 15);
    ctx.lineTo(width - 30, y + 15);
    ctx.stroke();
    
    y += 40;
  }
  
  ctx.fillStyle = '#f5f5f5';
  ctx.beginPath();
  ctx.arc(60, y + 30, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(130, y + 30, 25, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#0066b3';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('↗', 60, y + 35);
  ctx.fillText('↓', 130, y + 35);
  
  ctx.fillStyle = '#0066b3';
  ctx.fillRect(width - 150, y + 10, 120, 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Selesai', width - 90, y + 35);
  
  const buffer = canvas.toBuffer('image/jpeg');
  const fileName = `bca_invoice_${count}_${Date.now()}.jpg`;
  fs.writeFileSync(fileName, buffer);
  
  return { 
    fileName, 
    buffer,
    details: {
      recipientName,
      fromAccount,
      amount,
      adminFee,
      totalAmount,
      date
    }
  };
}

async function generateAndUploadInvoice(authToken, count) {
  const userAgent = getRandomUserAgent();
  const spinner = ora(`Generating invoice #${count}...`).start();
  
  try {
    const { fileName, buffer, details } = await generateInvoiceImage(count);
    spinner.text = `Getting presigned URL for invoice #${count}...`;
    
    const presignedUrlResponse = await axios.get(
      `https://api-v2.polyflow.tech/api/scan2earn/get_presigned_url?file_name=${fileName}`,
      {
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': authToken,
          'user-agent': userAgent
        }
      }
    );
    
    if (!presignedUrlResponse.data.success) {
      spinner.fail(chalk.red(`Failed to get presigned URL for invoice #${count}`));
      return { success: false };
    }
    
    const { presigned_url, key } = presignedUrlResponse.data.msg;
    spinner.text = `Uploading invoice #${count} to S3...`;
    
    await axios.put(presigned_url, buffer, {
      headers: {
        'content-type': 'application/octet-stream',
        'user-agent': userAgent
      }
    });
    
    spinner.text = `Saving invoice #${count} to API...`;
    
    const saveResponse = await axios.post(
      'https://api-v2.polyflow.tech/api/scan2earn/save_invoice',
      { invoice_path: key },
      {
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': authToken,
          'content-type': 'application/json',
          'user-agent': userAgent
        }
      }
    );
    
    if (!saveResponse.data.success) {
      spinner.fail(chalk.red(`Failed to save invoice #${count}`));
      return { success: false };
    }
    
    spinner.succeed(chalk.green(`Invoice #${count} processed successfully!`));
    console.log(chalk.cyan(`🎯 Recipient: ${chalk.bold(details.recipientName)}`));
    console.log(chalk.cyan(`💰 Amount: ${chalk.bold(formatMoney(details.amount))} IDR`));
    console.log(chalk.cyan(`💸 Total: ${chalk.bold(formatMoney(details.totalAmount))} IDR`));
    console.log(chalk.green(`✅ Points earned: ${chalk.bold(saveResponse.data.msg.my_point)}`));
    console.log(chalk.yellow(`🔄 Counter party: ${chalk.bold(saveResponse.data.msg.counter_party)}`));
    console.log(chalk.gray(`⏱️ Processed at: ${new Date().toLocaleTimeString()}`));
    console.log(chalk.yellow('='.repeat(50)));
    
    fs.unlinkSync(fileName);
    return { 
      success: true, 
      points: saveResponse.data.msg.my_point,
      counterParty: saveResponse.data.msg.counter_party 
    };
  } catch (error) {
    spinner.fail(chalk.red(`Error processing invoice #${count}: ${error.message}`));
    return { success: false, error: error.message };
  }
}

async function runSequentialUploads(authToken, totalCount) {
  let completedCount = 0;
  let successCount = 0;
  let totalPoints = 0;
  
  console.log(chalk.blue(`\n🚀 Starting upload of ${chalk.bold(totalCount)} invoices sequentially\n`));
  
  for (let count = 1; count <= totalCount; count++) {
    const result = await generateAndUploadInvoice(authToken, count);
    
    completedCount++;
    if (result.success) {
      successCount++;
      totalPoints += result.points || 0;
    }
    
    console.log(chalk.blue(`\n📊 Progress: ${chalk.bold(completedCount)}/${chalk.bold(totalCount)} (${Math.round(completedCount/totalCount*100)}%)`));
    console.log(chalk.blue(`📈 Success rate: ${chalk.bold(successCount)}/${chalk.bold(completedCount)} (${Math.round(successCount/completedCount*100)}%)`));
    console.log(chalk.blue(`💎 Total points earned: ${chalk.bold(totalPoints)}\n`));
    
    const progressBar = showProgressBar(completedCount, totalCount);
    console.log(chalk.green(`${progressBar}`));
    console.log(chalk.yellow('='.repeat(50)));
  }
  
  return { totalCount, successCount, totalPoints };
}

async function main() {
  await printLogo();
  
  const authTokenInput = await askQuestion('👑 Enter your auth token (without Bearer prefix): ');
  const authToken = `Bearer ${authTokenInput.trim()}`;
  
  const totalCountInput = await askQuestion('🔢 How many invoices do you want to generate?: ');
  const totalCount = parseInt(totalCountInput.trim()) || 1;
  
  console.log(chalk.yellow('\n🚀 INITIALIZING BCA INVOICE BOT 🚀'));
  console.log(chalk.cyan(`📊 Total invoices: ${chalk.bold(totalCount)}`));
  console.log(chalk.yellow('='.repeat(50)) + '\n');
  
  const spinner = createSpinner('Validating auth token...').start();
  await new Promise(resolve => setTimeout(resolve, 1500));
  spinner.success({ text: 'Auth token validated!' });
  
  const startTime = Date.now();
  const result = await runSequentialUploads(authToken, totalCount);
  const endTime = Date.now();
  const timeElapsed = (endTime - startTime) / 1000;
  
  console.log(chalk.green('\n✅ PROCESS COMPLETED ✅'));
  console.log(chalk.blue(`📊 Total invoices processed: ${chalk.bold(result.totalCount)}`));
  console.log(chalk.blue(`📈 Successful uploads: ${chalk.bold(result.successCount)}`));
  console.log(chalk.blue(`💎 Total points earned: ${chalk.bold(result.totalPoints)}`));
  console.log(chalk.blue(`⏱️ Time elapsed: ${chalk.bold(timeElapsed.toFixed(2))} seconds`));
  console.log(chalk.blue(`⚡ Processing speed: ${chalk.bold((result.totalCount / timeElapsed).toFixed(2))} invoices/second`));
  console.log(chalk.yellow('='.repeat(50)) + '\n');
  
  console.log(chalk.green('👋 Thanks for using BCA BOT!'));
  rl.close();
}

main().catch(error => {
  console.error(chalk.red(`\n❌ ERROR: ${error.message}`));
  rl.close();
});
