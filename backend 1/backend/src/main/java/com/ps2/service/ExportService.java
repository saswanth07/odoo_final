package com.ps2.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ExportService {

    public byte[] exportToPdf(String reportType, String data) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();
            
            document.add(new Paragraph("Cafe POS - " + reportType + " Report"));
            document.add(new Paragraph("--------------------------------------------------"));
            document.add(new Paragraph(data));
            
            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    public byte[] exportToExcel(String reportType, String data) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(reportType);
            
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Report Type");
            headerRow.createCell(1).setCellValue("Data");
            
            Row dataRow = sheet.createRow(1);
            dataRow.createCell(0).setCellValue(reportType);
            dataRow.createCell(1).setCellValue(data);
            
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Error generating Excel", e);
        }
    }
}
