<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.md">English</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/civility-kernel/readme.png" alt="civility-kernel logo" width="360" />
</div>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/civility-kernel/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/civility-kernel/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License"></a>
  <a href="https://mcp-tool-shop-org.github.io/civility-kernel/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page"></a>
  <a href="https://www.npmjs.com/package/@mcptoolshop/civility-kernel"><img src="https://img.shields.io/npm/v/%40mcptoolshop%2Fcivility-kernel" alt="npm version"></a>
</p>

एक नीति परत जो एजेंट के व्यवहार को केवल दक्षता को अधिकतम करने के बजाय, **पसंदीदा विकल्पों** द्वारा निर्देशित करती है।

यह चार चीजें विश्वसनीय रूप से करता है:

1) **लिंट** नीतियां (टूटी हुई या असुरक्षित कॉन्फ़िगरेशन को शिप होने से पहले पकड़ें)।
2) **मानकीकृत** नीतियां (समान इनपुट एक ही आउटपुट उत्पन्न करते हैं)।
3) **अंतर + अनुमोदन** परिवर्तन (मानव-पठनीय, स्पष्ट सहमति)।
4) **स्वचालित रूप से वापस लेना** (ओवरराइट करने से पहले पिछली नीति को सहेजें)।

यह वह "सुरक्षा तंत्र" है जो आपको "सीमाओं वाले एजेंट" बनाने की अनुमति देता है।

---

## मुख्य विचार

आपका एजेंट संभावित योजनाओं को उत्पन्न करता है। "सिविलिटी-कर्नेल" यह तय करता है कि आगे क्या होगा:

**उत्पन्न करें → फ़िल्टर (कठोर बाधाएं) → स्कोर (भार) → चुनें या पूछें**

कठोर बाधाएं गैर-समझौता योग्य हैं। नरम प्राथमिकताएं ट्रेडऑफ़ का मार्गदर्शन करती हैं। अनिश्चितता "मानव से पूछने" के लिए मजबूर कर सकती है।

---

## स्थापना

```bash
npm i @mcptoolshop/civility-kernel
```

## मानव नियंत्रण लूप

आप हमेशा देख सकते हैं कि आपकी नीति क्या करती है।
एजेंट को परिवर्तन लागू करने से पहले उन्हें दिखाना चाहिए।
आप वापस जा सकते हैं।
कुछ भी चुपचाप अपडेट नहीं होता है।

नीति अनुबंध का पूर्वावलोकन करें:
```bash
npm run policy:explain
```

एक अपडेट प्रस्तावित करें (अंतर दिखाता है, अनुमोदन के लिए संकेत देता है):
```bash
npm run policy:propose
```

वर्तमान नीति फ़ाइल को मानकीकृत करें (केवल प्रारूप सामान्यीकरण):
```bash
npm run policy:canonicalize
```

### स्वचालित रोलबैक सुरक्षा

परिवर्तनों को लागू करते समय, `policy-check` पहले पुरानी नीति का बैकअप ले सकता है:

```bash
npx tsx scripts/policy-check.ts policies/default.json --propose policies/proposed.json --write-prev policies/previous.json
```

## नीति फ़ाइलें

अनुशंसित सम्मेलन:

- `policies/default.json` — सक्रिय नीति
- `policies/previous.json` — स्वचालित रोलबैक लक्ष्य
- `policies/profiles/*.json` — नामित प्रोफाइल (कार्य / कम-घर्षण / सुरक्षित-मोड)

## CLI विकल्प (policy-check)

- `--explain` — एक मानव-पठनीय नीति सारांश प्रिंट करें
- `--propose <file>` — लिंट + मानकीकृत अंतर दिखाएं + अनुमोदन के लिए संकेत दें
- `--apply` — नीति फ़ाइल को मानकीकृत रूप में फिर से लिखें
- `--write-prev <file>` — ओवरराइट करने से पहले पुरानी मानकीकृत नीति का बैकअप लें
- `--diff short|full` — "हेडलाइन" परिवर्तन दिखाता है; पूर्ण सब कुछ दिखाता है
- `--prev <file>` — नियतात्मक CI अंतर मोड

## सार्वजनिक एपीआई

- `lintPolicy(policy, { registry, scorers })`
- `canonicalizePolicy(policy, registry, scorers?)`
- `diffPolicy(a, b, { mode })` (शॉर्ट बनाम फुल)
- `explainPolicy(policy, registry, { format })`

## CI

CI रन:
- उदाहरण
- परीक्षण
- निर्माण
- `policy-check` फिक्स्चर के विरुद्ध (`policies/default.json` बनाम `policies/previous.json`)

यह टूटी हुई नीतियों या भ्रामक अंतरों को शिप होने से रोकता है।

## विकास

```bash
npm test
npm run build
npm run example:basic
npm run policy:check
```

## सुरक्षा और डेटा दायरा

सिविलिटी कर्नेल एक **शुद्ध लाइब्रेरी** है - कोई नेटवर्क अनुरोध नहीं, कोई टेलीमेट्री नहीं, कोई दुष्प्रभाव नहीं।

- **पहुंचे गए डेटा:** स्थानीय फ़ाइल सिस्टम से JSON नीति फ़ाइलों को पढ़ता है। प्रक्रिया में नीति दस्तावेजों को मान्य करता है, मानकीकृत करता है और अंतर करता है। सभी ऑपरेशन नियतात्मक हैं।
- **पहुंचे गए डेटा नहीं:** कोई नेटवर्क अनुरोध नहीं। कोई टेलीमेट्री नहीं। कोई क्रेडेंशियल स्टोरेज नहीं। कर्नेल नीति बाधाओं का मूल्यांकन करता है - यह एजेंट की क्रियाओं को नहीं देखता है या लॉग नहीं करता है।
- **आवश्यक अनुमतियाँ:** नीति JSON फ़ाइलों के लिए फ़ाइल सिस्टम पढ़ने की अनुमति। केवल तभी लिखने की अनुमति जब `--apply` के माध्यम से स्पष्ट रूप से अनुरोध किया जाए।

भेद्यता रिपोर्टिंग के लिए [SECURITY.md](SECURITY.md) देखें।

---

## स्कोरकार्ड

| श्रेणी | स्कोर |
|----------|-------|
| सुरक्षा | 10/10 |
| त्रुटि प्रबंधन | 10/10 |
| ऑपरेटर दस्तावेज़ | 10/10 |
| शिपिंग स्वच्छता | 10/10 |
| पहचान | 10/10 |
| **Overall** | **50/50** |

---

## लाइसेंस

MIT (लाइसेंस देखें)

---

<a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a> द्वारा निर्मित
