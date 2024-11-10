
const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")()
const readline = require("readline");
const { ethers, JsonRpcProvider } = require("ethers")
require('dotenv').config();

StealthPlugin.enabledEvasions.delete("iframe.contentWindow")
StealthPlugin.enabledEvasions.delete("navigator.plugins")
StealthPlugin.enabledEvasions.delete("media.codecs")

puppeteer.use(StealthPlugin)

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getUserInput(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => {
    rl.question(prompt, (input) => {
      rl.close()
      resolve(input)
    })
  })
}

async function loginPopup(page, email, password) {
  try {
    await page.waitForSelector("div > button.flex.cursor-pointer")
    await page.click("div > button.flex.cursor-pointer")

    const popup = await new Promise((resolve) => {
      page.on("popup", (newPage) => resolve(newPage))
    })

    await popup.waitForSelector('input[type="email"]', { timeout: 10000 })
    await popup.type('input[type="email"]', email)
    await popup.click("#identifierNext")

    await popup.waitForSelector('input[type="password"]', { visible: true, timeout: 10000 })
    await popup.type('input[type="password"]', password)
    await popup.click("#passwordNext")

    await popup.waitForNavigation({ waitUntil: "networkidle2" })
    await wait(2000)
    console.log("Login berhasil.")
  } catch (error) {
    console.error("Error saat login di popup:", error)
  }
}

async function grow(page) {
  
  
    try {
      await wait(15000)
      await page.click("canvas")
      await wait(5000)

      const revealedElement = await page.waitForSelector("div[data-revealed='true']", { visible: true })

      if (revealedElement) {
        const points = await page.$eval("p.absolute.left-1\\/2.top-1\\/2.mt-1.flex", (el) => el.textContent.trim())
        console.log(`Poin yang didapat: ${points}`)

        await wait(3000)

        const growAgainButton = await page.$("button.shiny-button.h-\\[57px\\].w-\\[224px\\].rounded-\\[8px\\].text-\\[12px\\]")
        if (growAgainButton) {
          await growAgainButton.click()
          

          await page.evaluate(() => {
            const revealedElement = document.querySelector("div[data-revealed='true']")
            if (revealedElement) {
              revealedElement.setAttribute("data-revealed", "false")
            }
          })
          
        } else {
          console.log("Gagal, mungkin grow sudah habis")
        }

        await wait(8000)
        await page.click("canvas")
      } else {
        console.log("Tidak ada elemen yang terbuka.")
      }
    } catch (error) {
      console.error("An error occurred:", error)
      
    }
  
}

async function deposit(pKey,amount) {
  const providerUrl = "https://arb1.arbitrum.io/rpc"
  const privateKey = pKey
  const contractAddress = "0xC5bf05cD32a14BFfb705Fb37a9d218895187376c"
  const depositAmount = amount
  

  try {
    const provider = new JsonRpcProvider(providerUrl)
    const wallet = new ethers.Wallet(privateKey, provider)

    const tx = {
      to: contractAddress,
      value: ethers.parseEther(depositAmount),
      gasLimit: 200000,
      data: "0xf6326fb3",
    }

    const txResponse = await wallet.sendTransaction(tx)
    console.log("Transaction sent! Hash:", txResponse.hash)

    const receipt = await txResponse.wait()
    console.log("Transaction confirmed in block", receipt.blockNumber)
  } catch (error) {
    console.error("Error while depositing:", error)
  }
}



async function autoHana() {
  const data = {
  email:process.env.USER_EMAIL,
  password:process.env.USER_PASSWORD,
  privateKey:process.env.USER_PRIVATE_KEY
  }
  

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  })

  const page = await browser.newPage()
  await browser.defaultBrowserContext().overridePermissions("https://hanafuda.hana.network", ["notifications"])
  await page.goto("https://hanafuda.hana.network", { waitUntil: "networkidle2" })

  await loginPopup(page, data.email, data.password)

  while (true) {
    console.log("1. Untuk auto grow")
    console.log("2. Untuk auto transaction")
    console.log("0. Keluar")
    const option = await getUserInput("Pilih opsi (1 / 2 / 0): ")

    if (option === "0") {
      console.log("Proses dihentikan.")
      break
    }

    if (option === "1") {
      console.log("Mengarah ke halaman grow")
      const count = await getUserInput("Anda ingin berapa kali grow? ")
      const growCount = parseInt(count)

      if (isNaN(growCount) || growCount <= 0) {
        console.log("Masukkan jumlah grow yang valid")
        continue
      }

      await page.goto("https://hanafuda.hana.network/grow", { waitUntil: "networkidle2" })
      for (let i = 1; i <= growCount; i++) {
        await grow(page)
        console.log(`Grow ${i} berhasil`)
        console.log("Mohon Tunggu")
        await wait(2000)
      }
    } else if (option === "2") {
      console.log("Mengarah ke halaman deposit")
      const amount = await getUserInput("Masukkan jumlah deposit: ")
      const count = await getUserInput("Anda ingin berapa kali deposit? ")
      const depositCount = parseInt(count)
      

      if (isNaN(depositCount) || depositCount <= 0) {
        console.log("Masukkan jumlah deposit yang valid")
        continue
      }

      await page.goto("https://hanafuda.hana.network/deposit", { waitUntil: "networkidle2" })
      console.log(amount)
      for (let i = 1; i <= depositCount; i++) {
        await deposit(data.privateKey,amount)
        console.log(`Deposit ${i} berhasil`)
        await wait(4000)
      }
    } else {
      console.log("Hanya angka 1, 2, atau 0 yang valid")
    }
  }

  await browser.close()
}



autoHana()
