"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

type QRCodeType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard';

interface SavedQRCode {
  id: string;
  type: QRCodeType;
  value: string;
  title: string;
  date: string;
  settings: {
    qrColor: string;
    qrBgColor: string;
    qrSize: number;
    errorCorrectionLevel: string;
    logoImage: string | null;
  };
}

export default function QrCodeGenerator() {
  const [qrType, setQrType] = useState<QRCodeType>('url');
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phone, setPhone] = useState("");
  const [smsNumber, setSmsNumber] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiType, setWifiType] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [vcardFirstName, setVcardFirstName] = useState("");
  const [vcardLastName, setVcardLastName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");
  const [vcardTitle, setVcardTitle] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#FFFFFF");
  const [qrSize, setQrSize] = useState(200);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("H");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [savedQRCodes, setSavedQRCodes] = useState<SavedQRCode[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");

  useEffect(() => {
    const storedQRCodes = localStorage.getItem('savedQRCodes');
    if (storedQRCodes) {
      setSavedQRCodes(JSON.parse(storedQRCodes));
    }
  }, []);

  const getQRCodeValue = () => {
    switch (qrType) {
      case 'url':
        return url;
      case 'text':
        return text;
      case 'email':
        return `mailto:${email}${emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ''}${emailBody ? `${emailSubject ? '&' : '?'}body=${encodeURIComponent(emailBody)}` : ''}`;
      case 'phone':
        return `tel:${phone}`;
      case 'sms':
        return `sms:${smsNumber}${smsMessage ? `?body=${encodeURIComponent(smsMessage)}` : ''}`;
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
N:${vcardLastName};${vcardFirstName};;;
FN:${vcardFirstName} ${vcardLastName}
ORG:${vcardOrg}
TITLE:${vcardTitle}
TEL:${vcardPhone}
EMAIL:${vcardEmail}
END:VCARD`;
      default:
        return '';
    }
  };

  const generateQrCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (getQRCodeValue()) {
      setQrGenerated(true);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoImage(event.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadQrCode = (format: 'png' | 'svg' = 'png') => {
    if (!qrRef.current) return;
    
    if (format === 'png') {
      const canvas = qrRef.current.querySelector("canvas");
      if (!canvas) return;
      
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      
      let filename = `qrcode-${qrType}-`;
      switch (qrType) {
        case 'url':
          filename += url.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        case 'text':
          filename += text.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        case 'email':
          filename += email.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        case 'phone':
          filename += phone.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        case 'vcard':
          filename += `${vcardFirstName}-${vcardLastName}`.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        case 'wifi':
          filename += wifiSsid.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        default:
          filename += "qrcode";
      }
      
      downloadLink.download = `${filename}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else if (format === 'svg') {
      const svgElement = qrRef.current.querySelector("canvas")?.nextSibling as SVGElement;
      if (!svgElement) return;
      
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(clonedSvg);
      
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      
      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      
      let filename = `qrcode-${qrType}-`;
      switch (qrType) {
        case 'url':
          filename += url.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        case 'text':
          filename += text.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        case 'email':
          filename += email.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        case 'phone':
          filename += phone.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        case 'vcard':
          filename += `${vcardFirstName}-${vcardLastName}`.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        case 'wifi':
          filename += wifiSsid.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
          break;
        default:
          filename += "qrcode";
      }
      
      downloadLink.download = `${filename}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    }
  };

  const saveQrCodeToStorage = () => {
    if (!qrGenerated) return;

    const qrCodeValue = getQRCodeValue();
    if (!qrCodeValue) return;

    const newQRCode: SavedQRCode = {
      id: Date.now().toString(),
      type: qrType,
      value: qrCodeValue,
      title: saveTitle || generateDefaultTitle(),
      date: new Date().toLocaleString(),
      settings: {
        qrColor,
        qrBgColor,
        qrSize,
        errorCorrectionLevel,
        logoImage
      }
    };

    const updatedQRCodes = [...savedQRCodes, newQRCode];
    setSavedQRCodes(updatedQRCodes);
    localStorage.setItem('savedQRCodes', JSON.stringify(updatedQRCodes));
    setSaveTitle("");
    alert("QR code saved successfully!");
  };

  const generateDefaultTitle = () => {
    switch (qrType) {
      case 'url':
        return url.substring(0, 30);
      case 'text':
        return text.substring(0, 30);
      case 'email':
        return email;
      case 'phone':
        return phone;
      case 'vcard':
        return `${vcardFirstName} ${vcardLastName}`;
      case 'wifi':
        return wifiSsid;
      default:
        return `QR Code ${new Date().toLocaleDateString()}`;
    }
  };

  const loadQrCode = (savedQR: SavedQRCode) => {
    setShowHistory(false);

    setUrl("");
    setText("");
    setEmail("");
    setEmailSubject("");
    setEmailBody("");
    setPhone("");
    setSmsNumber("");
    setSmsMessage("");
    setWifiSsid("");
    setWifiPassword("");
    setWifiType("WPA");
    setWifiHidden(false);
    setVcardFirstName("");
    setVcardLastName("");
    setVcardPhone("");
    setVcardEmail("");
    setVcardOrg("");
    setVcardTitle("");

    setQrType(savedQR.type);
    setQrColor(savedQR.settings.qrColor);
    setQrBgColor(savedQR.settings.qrBgColor);
    setQrSize(savedQR.settings.qrSize);
    setErrorCorrectionLevel(savedQR.settings.errorCorrectionLevel);
    setLogoImage(savedQR.settings.logoImage);

    switch (savedQR.type) {
      case 'url':
        setUrl(savedQR.value);
        break;
      case 'text':
        setText(savedQR.value);
        break;
      case 'email':
        if (savedQR.value.startsWith('mailto:')) {
          const emailParts = savedQR.value.substring(7);
          const addressParts = emailParts.split('?');
          setEmail(addressParts[0]);

          if (addressParts.length > 1) {
            const params = new URLSearchParams(addressParts[1]);
            setEmailSubject(decodeURIComponent(params.get('subject') || ''));
            setEmailBody(decodeURIComponent(params.get('body') || ''));
          }
        }
        break;
      case 'phone':
        setPhone(savedQR.value.replace('tel:', ''));
        break;
      case 'sms':
        if (savedQR.value.startsWith('sms:')) {
          const smsParts = savedQR.value.substring(4).split('?');
          setSmsNumber(smsParts[0]);

          if (smsParts.length > 1) {
            const params = new URLSearchParams(smsParts[1]);
            setSmsMessage(decodeURIComponent(params.get('body') || ''));
          }
        }
        break;
      case 'wifi':
        if (savedQR.value.startsWith('WIFI:')) {
          const wifiString = savedQR.value;
          const typeMatch = wifiString.match(/T:([^;]+);/);
          const ssidMatch = wifiString.match(/S:([^;]+);/);
          const passMatch = wifiString.match(/P:([^;]+);/);
          const hiddenMatch = wifiString.match(/H:([^;]+);/);

          if (typeMatch) setWifiType(typeMatch[1]);
          if (ssidMatch) setWifiSsid(ssidMatch[1]);
          if (passMatch) setWifiPassword(passMatch[1]);
          if (hiddenMatch) setWifiHidden(hiddenMatch[1] === 'true');
        }
        break;
      case 'vcard':
        try {
          const vcardLines = savedQR.value.split('\n');
          const nameMatch = vcardLines.find(line => line.startsWith('N:'))?.substring(2);
          if (nameMatch) {
            const nameParts = nameMatch.split(';');
            setVcardLastName(nameParts[0] || '');
            setVcardFirstName(nameParts[1] || '');
          }
          const orgMatch = vcardLines.find(line => line.startsWith('ORG:'))?.substring(4);
          if (orgMatch) {
            setVcardOrg(orgMatch);
          }
          const titleMatch = vcardLines.find(line => line.startsWith('TITLE:'))?.substring(6);
          if (titleMatch) {
            setVcardTitle(titleMatch);
          }
          const phoneMatch = vcardLines.find(line => line.startsWith('TEL:'))?.substring(4);
          if (phoneMatch) {
            setVcardPhone(phoneMatch);
          }
          const emailMatch = vcardLines.find(line => line.startsWith('EMAIL:'))?.substring(6);
          if (emailMatch) {
            setVcardEmail(emailMatch);
          }
        } catch (error) {
          console.error("Error parsing vCard data:", error);
        }
        break;
    }

    setQrGenerated(true);
  };

  const deleteQrCode = (id: string) => {
    if (confirm("Are you sure you want to delete this QR code?")) {
      const updatedQRCodes = savedQRCodes.filter(qr => qr.id !== id);
      setSavedQRCodes(updatedQRCodes);
      localStorage.setItem('savedQRCodes', JSON.stringify(updatedQRCodes));
    }
  };

  const renderInputFields = () => {
    switch (qrType) {
      case 'url':
        return (
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              Enter URL
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
        );
      case 'text':
        return (
          <div className="mb-4">
            <label htmlFor="text" className="block text-sm font-medium mb-2">
              Enter Text
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter any text to encode"
              className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              rows={4}
              required
            />
          </div>
        );
      case 'email':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="emailSubject" className="block text-sm font-medium mb-2">
                Subject (Optional)
              </label>
              <input
                id="emailSubject"
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="emailBody" className="block text-sm font-medium mb-2">
                Body (Optional)
              </label>
              <textarea
                id="emailBody"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Email content"
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                rows={3}
              />
            </div>
          </>
        );
      case 'phone':
        return (
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
        );
      case 'sms':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="smsNumber" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                id="smsNumber"
                type="tel"
                value={smsNumber}
                onChange={(e) => setSmsNumber(e.target.value)}
                placeholder="+1234567890"
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="smsMessage" className="block text-sm font-medium mb-2">
                Message (Optional)
              </label>
              <textarea
                id="smsMessage"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Your SMS message"
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                rows={3}
              />
            </div>
          </>
        );
      case 'wifi':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="wifiSsid" className="block text-sm font-medium mb-2">
                Network Name (SSID)
              </label>
              <input
                id="wifiSsid"
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="WiFi Network Name"
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="wifiType" className="block text-sm font-medium mb-2">
                Security Type
              </label>
              <select
                id="wifiType"
                value={wifiType}
                onChange={(e) => setWifiType(e.target.value)}
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="WPA">WPA/WPA2/WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
            {wifiType !== 'nopass' && (
              <div className="mb-4">
                <label htmlFor="wifiPassword" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="wifiPassword"
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="WiFi Password"
                  className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  required={wifiType !== 'nopass'}
                />
              </div>
            )}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={wifiHidden}
                  onChange={(e) => setWifiHidden(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Hidden Network</span>
              </label>
            </div>
          </>
        );
      case 'vcard':
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="vcardFirstName" className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  id="vcardFirstName"
                  type="text"
                  value={vcardFirstName}
                  onChange={(e) => setVcardFirstName(e.target.value)}
                  className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <label htmlFor="vcardLastName" className="block text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  id="vcardLastName"
                  type="text"
                  value={vcardLastName}
                  onChange={(e) => setVcardLastName(e.target.value)}
                  className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="vcardPhone" className="block text-sm font-medium mb-2">
                Phone
              </label>
              <input
                id="vcardPhone"
                type="tel"
                value={vcardPhone}
                onChange={(e) => setVcardPhone(e.target.value)}
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="vcardEmail" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="vcardEmail"
                type="email"
                value={vcardEmail}
                onChange={(e) => setVcardEmail(e.target.value)}
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="vcardOrg" className="block text-sm font-medium mb-2">
                Organization
              </label>
              <input
                id="vcardOrg"
                type="text"
                value={vcardOrg}
                onChange={(e) => setVcardOrg(e.target.value)}
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="vcardTitle" className="block text-sm font-medium mb-2">
                Title/Role
              </label>
              <input
                id="vcardTitle"
                type="text"
                value={vcardTitle}
                onChange={(e) => setVcardTitle(e.target.value)}
                className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">QR code generator</h1>
      
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={() => setShowHistory(false)}
          className={`px-4 py-2 rounded-md ${!showHistory ? 'bg-foreground text-background' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Create QR
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className={`px-4 py-2 rounded-md ${showHistory ? 'bg-foreground text-background' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          History ({savedQRCodes.length})
        </button>
      </div>

      {!showHistory ? (
        <>
          <div className="mb-6">
            <label htmlFor="qrType" className="block text-sm font-medium mb-2">
              QR Code Type
            </label>
            <select
              id="qrType"
              value={qrType}
              onChange={(e) => {
                setQrType(e.target.value as QRCodeType);
                setQrGenerated(false);
              }}
              className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="url">Website URL</option>
              <option value="text">Plain Text</option>
              <option value="email">Email Address</option>
              <option value="phone">Phone Number</option>
              <option value="sms">SMS Message</option>
              <option value="wifi">WiFi Network</option>
              <option value="vcard">Contact (vCard)</option>
            </select>
          </div>
          
          <form onSubmit={generateQrCode} className="mb-6">
            {renderInputFields()}
            
            <div className="mb-4 border rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
                className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 text-sm font-medium"
              >
                Customize QR Code
                <svg 
                  className={`w-5 h-5 transition-transform ${isCustomizeOpen ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCustomizeOpen && (
                <div className="p-3 border-t">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="qrColor" className="block text-sm mb-1">
                        QR Code Color
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          id="qrColor"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="w-10 h-10 border rounded"
                        />
                        <input
                          type="text"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="ml-2 p-2 border rounded-md text-sm w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="qrBgColor" className="block text-sm mb-1">
                        Background Color
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          id="qrBgColor"
                          value={qrBgColor}
                          onChange={(e) => setQrBgColor(e.target.value)}
                          className="w-10 h-10 border rounded"
                        />
                        <input
                          type="text"
                          value={qrBgColor}
                          onChange={(e) => setQrBgColor(e.target.value)}
                          className="ml-2 p-2 border rounded-md text-sm w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="qrSize" className="block text-sm mb-1">
                      QR Code Size: {qrSize}px
                    </label>
                    <input
                      type="range"
                      id="qrSize"
                      min="100"
                      max="400"
                      step="10"
                      value={qrSize}
                      onChange={(e) => setQrSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="errorLevel" className="block text-sm mb-1">
                      Error Correction Level
                    </label>
                    <select
                      id="errorLevel"
                      value={errorCorrectionLevel}
                      onChange={(e) => setErrorCorrectionLevel(e.target.value)}
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm mb-1">
                      Add Logo (Optional)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="text-sm w-full"
                      />
                      {logoImage && (
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-foreground text-background p-3 rounded-md hover:opacity-90 transition-opacity"
            >
              Generate QR Code
            </button>
          </form>

          {qrGenerated && (
            <div className="flex flex-col items-center">
              <div 
                ref={qrRef}
                className="bg-white p-4 rounded-md mb-4"
              >
                <QRCodeCanvas 
                  value={getQRCodeValue()} 
                  size={qrSize}
                  level={errorCorrectionLevel as "L" | "M" | "Q" | "H"}
                  includeMargin={true}
                  fgColor={qrColor}
                  bgColor={qrBgColor}
                  imageSettings={logoImage ? {
                    src: logoImage,
                    width: qrSize * 0.25,
                    height: qrSize * 0.25,
                    excavate: true,
                  } : undefined}
                />
              </div>
              
              <div className="flex flex-col w-full space-y-3 mb-4">
                <div className="flex space-x-2 w-full">
                  <button
                    onClick={() => downloadQrCode('png')}
                    className="flex-1 bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Download PNG
                  </button>
                  <button
                    onClick={() => downloadQrCode('svg')}
                    className="flex-1 bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Download SVG
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    placeholder="Enter title to save (optional)"
                    className="flex-1 p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={saveQrCodeToStorage}
                    className="bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="saved-qr-codes">
          <h2 className="text-xl font-semibold mb-4">Saved QR Codes</h2>
          
          {savedQRCodes.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No saved QR codes found</p>
          ) : (
            <div className="space-y-4">
              {savedQRCodes.map((savedQR) => (
                <div key={savedQR.id} className="border rounded-md p-4 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{savedQR.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => loadQrCode(savedQR)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteQrCode(savedQR.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {savedQR.date} • {savedQR.type}
                  </div>
                  <div className="truncate text-sm text-gray-600 dark:text-gray-400">
                    {savedQR.value.substring(0, 50)}{savedQR.value.length > 50 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}