import { View } from "react-native";
import { WebView } from "react-native-webview";
import { pdfPreviewHtml } from "./pdfPreviewHtml";
import { isCertificatePng } from './certificatePng';
export function PdfPreview({ url, onPng }: { url: string; onPng?: (uri: string) => void }) {
  return (
    <View style={{ height: 260 }}>
      <WebView
        source={{ html: pdfPreviewHtml(url, !!onPng) }}
        onMessage={event => { try { const data = JSON.parse(event.nativeEvent.data); if (data.type === 'certificatePng' && isCertificatePng(data.dataUrl)) onPng?.(data.dataUrl); } catch { /* Ignore non-image messages. */ } }}
        originWhitelist={["*"]}
        onShouldStartLoadWithRequest={(r) => r.url === "about:blank"}
        accessibilityLabel="Certificate PDF preview"
      />
    </View>
  );
}
