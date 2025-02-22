# LANxfer - Offline LAN File Sharing

## 📌 Introduction
LANxfer is a lightweight, cross-platform tool for offline file sharing over a **local network (LAN/Wi-Fi)** without needing internet access. It allows devices to transfer files seamlessly using various offline networking methods.

## 🚀 Features
- Peer-to-peer file transfer over a local network.
- No internet required; works entirely offline.
- Drag-and-drop interface for easy file sharing.
- Cross-platform support (Windows, Linux, macOS, Android via browser).
- Secure and private; no cloud storage or external APIs involved.

---

## 📂 Setup and Installation
### 1️⃣ Prerequisites
- **Python 3.7+** installed
- **Flask** (Install using `pip install flask`)
- A device with a **Wi-Fi adapter**

### 2️⃣ Clone the Repository
```sh
    git clone https://github.com/yourusername/LANxfer.git
    cd LANxfer
```

### 3️⃣ Run the Application
```sh
    python app.py
```
This starts the server on your local machine.

---

## 📡 Connecting Devices Without Internet
### Method 1: **Using Laptop Hotspot (Windows/Mac/Linux)**
If your laptop supports **creating a hotspot**, follow these steps:

1. **Enable Hotspot on Your Laptop:**
   - **Windows:** `Settings → Network & Internet → Mobile Hotspot → Turn On`
   - **Mac:** `System Preferences → Sharing → Internet Sharing → Wi-Fi`
   - **Linux:** `Settings → Wi-Fi → Turn On Hotspot`

2. **Connect Other Devices** to the newly created Wi-Fi hotspot.
3. **Find the Local IP Address** of your server:
   ```sh
   ipconfig (Windows) or ifconfig (Mac/Linux)
   ```
   Look for **Wi-Fi IPv4 Address** (e.g., `192.168.137.1`).

4. **Access the File Sharing UI** from another device:
   ```
   http://<your-ip>:5000
   ```
   Example: `http://192.168.137.1:5000`

---

### Method 2: **Using Wi-Fi Direct (Peer-to-Peer Mode)**
If your laptop **does not support a hotspot**, you can use **Wi-Fi Direct** to establish a local connection.

1. **Enable Wi-Fi Direct on Your Devices:**
   - **Windows:** `Settings → Devices → Bluetooth & Other Devices → Wi-Fi Direct`
   - **Android:** `Settings → Wi-Fi → Advanced → Wi-Fi Direct`
2. **Connect Other Devices to the Host Laptop.**
3. **Find the Local IP Address** using `ipconfig` or `ifconfig`.
4. **Access the Web UI** using `http://<your-ip>:5000`.

---

### Method 3: **Using Mobile Hotspot (No Internet Needed)**
1. **Turn on Mobile Hotspot on Your Phone:**
   - **Android:** `Settings → Network & Internet → Hotspot & Tethering → Turn On Wi-Fi Hotspot`
   - **iPhone:** `Settings → Personal Hotspot → Turn On`
2. **Connect your laptop and other devices** to the mobile hotspot.
3. **Find the Local IP Address** using `ipconfig` or `ifconfig`.
4. **Access the File Sharing UI**:
   ```
   http://<your-ip>:5000
   ```
   Example: `http://192.168.43.1:5000`

---

## 📌 Troubleshooting
### **1. Unable to Start the Hotspot on Windows?**
   - Open Command Prompt as Admin and run:
     ```sh
     netsh wlan set hostednetwork mode=allow ssid=LANxfer key=12345678
     netsh wlan start hostednetwork
     ```
   - If this fails, try using Wi-Fi Direct instead.

### **2. Cannot Access Web UI on Other Devices?**
   - Ensure all devices are connected to the **same local network**.
   - Run `ipconfig` or `ifconfig` and confirm you are using the **correct IP address**.
   - Check if any firewall is **blocking Flask (Python)**.

### **3. Getting a 404 Error on File Upload?**
   - Make sure your `static` folder contains `script.js`.
   - Restart the Flask server and clear the browser cache.

