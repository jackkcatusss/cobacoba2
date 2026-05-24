// ==========================================
// RENAME & DUPLIKAT FILE + GANTI TANGGAL OTOMATIS
// ==========================================

function doGet(e) {
  const page = e && e.parameter && e.parameter.page ? e.parameter.page : 'index';
  
  let html;
  
  switch(page) {
    case 'rename':
      html = HtmlService.createHtmlOutputFromFile('dashboard')
        .setTitle('File Manager - Rename File')
        .setWidth(1400)
        .setHeight(900)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
      break;
    case 'duplicate':
      html = HtmlService.createHtmlOutputFromFile('dashboard')
        .setTitle('File Manager - Duplikat File')
        .setWidth(1400)
        .setHeight(900)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
      break;
    case 'autodate':
      html = HtmlService.createHtmlOutputFromFile('dashboard')
        .setTitle('File Manager - Ganti Tanggal Otomatis')
        .setWidth(1400)
        .setHeight(900)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
      break;
    case 'quickduplicate':
      html = HtmlService.createHtmlOutputFromFile('dashboard')
        .setTitle('File Manager - Duplikat Cepat')
        .setWidth(1400)
        .setHeight(900)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
      break;
    case 'index':
    default:
      html = HtmlService.createHtmlOutputFromFile('dashboard')
        .setTitle('File Manager - Dashboard')
        .setWidth(1400)
        .setHeight(900)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
      break;
  }
  
  return html;
}

// ==========================================
// FUNGSI AUTHORIZE
// ==========================================

function authorizeScript() {
  try {
    const testSheet = SpreadsheetApp.create("FileManager_TempAuth");
    testSheet.getRange("A1").setValue("Authorization OK");
    testSheet.getRange("B1").setValue(new Date());
    const folder = DriveApp.getRootFolder();
    const fileId = testSheet.getId();
    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
    Logger.log("✅ Authorization successful!");
    return { success: true, message: "Authorization successful" };
  } catch(e) {
    Logger.log("❌ Authorization failed: " + e.toString());
    return { success: false, error: e.toString() };
  }
}

// ==========================================
// DAFTAR SITUS (35 NAMA)
// ==========================================

function getSitusList() {
  return [
    "LINE TOGEL", "GENG TOTO", "GOL TOGEL", "TOGEL UP", "DINGDONG TOGEL",
    "HOME TOGEL", "INDRA TOGEL", "UDIN TOGEL", "JONI TOGEL", "FIA TOGEL",
    "PATIH TOTO", "YOK TOGEL", "YOWES TOGEL", "LUNA TOGEL", "OPPA TOTO",
    "TOGEL ON", "PRO TOGEL", "PWVIP4D", "MARIA TOGEL", "ZIA TOGEL",
    "DANA TOTO", "PARTAI TOGEL", "SITUS TOTO", "NANAS TOTO", "WDBOS",
    "BOS JOKO", "JUTAWANBET", "LATOTO", "MANCINGDUIT", "DEPOBOS",
    "TVTOTO", "PULITOTO", "WATITOTO", "ANGKABET", "FATCAI"
  ];
}

// ==========================================
// DAFTAR BULAN
// ==========================================

function getBulanList() {
  return [
    "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
    "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
  ];
}

// ==========================================
// AMBIL FILE DARI FOLDER
// ==========================================

function getFilesFromFolder(folderId) {
  try {
    if (!folderId) {
      return { success: false, error: 'Folder ID tidak boleh kosong!' };
    }
    
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
    
    const fileList = [];
    let nomor = 1;
    
    while (files.hasNext()) {
      const file = files.next();
      const oldName = file.getName();
      
      let extractedDate = '';
      const match = oldName.match(/(\d{2})\s+(\w+)\s+(\d{4})/);
      if (match) {
        extractedDate = `${match[1]} ${match[2]} ${match[3]}`;
      }
      
      fileList.push({
        nomor: nomor++,
        fileId: file.getId(),
        oldName: oldName,
        oldDate: extractedDate,
        selected: false
      });
    }
    
    fileList.sort((a, b) => a.nomor - b.nomor);
    
    return {
      success: true,
      files: fileList,
      total: fileList.length,
      folderName: folder.getName(),
      folderId: folderId,
      situsList: getSitusList(),
      bulanList: getBulanList()
    };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ==========================================
// GENERATE TANGGAL
// ==========================================

function generateDates(bulan, tahun, jumlahFile) {
  const bulanMap = {
    'JANUARI': 1, 'FEBRUARI': 2, 'MARET': 3, 'APRIL': 4, 'MEI': 5, 'JUNI': 6,
    'JULI': 7, 'AGUSTUS': 8, 'SEPTEMBER': 9, 'OKTOBER': 10, 'NOVEMBER': 11, 'DESEMBER': 12
  };
  
  const bulanIndex = bulanMap[bulan];
  const daysInMonth = new Date(tahun, bulanIndex, 0).getDate();
  
  const dates = [];
  for (let day = 1; day <= Math.min(daysInMonth, jumlahFile); day++) {
    const dayStr = day.toString().padStart(2, '0');
    dates.push(`${dayStr} ${bulan} ${tahun}`);
  }
  
  while (dates.length < jumlahFile) {
    for (let day = 1; day <= daysInMonth && dates.length < jumlahFile; day++) {
      const dayStr = day.toString().padStart(2, '0');
      dates.push(`${dayStr} ${bulan} ${tahun}`);
    }
  }
  
  return dates;
}

// ==========================================
// RENAME FILE
// ==========================================

function renameSelectedFiles(selectedItems, skipFirst, startFromNumber) {
  try {
    let successCount = 0;
    let failCount = 0;
    let results = [];
    
    selectedItems.sort((a, b) => a.originalNomor - b.originalNomor);
    let currentNumber = skipFirst ? startFromNumber : 1;
    
    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      const oldName = item.oldName;
      const fileId = item.fileId;
      const originalNomor = item.originalNomor;
      
      const day = currentNumber.toString().padStart(2, '0');
      const newDate = `${day} ${item.bulan} ${item.tahun}`;
      const newName = `${currentNumber}. ${item.situs} ${item.customText} - ${newDate}`;
      
      if (!newName || newName.trim() === '') {
        results.push({
          nomor: originalNomor,
          oldName: oldName,
          newName: newName,
          status: 'GAGAL',
          message: 'Nama baru kosong'
        });
        failCount++;
        currentNumber++;
        continue;
      }
      
      if (oldName === newName) {
        results.push({
          nomor: originalNomor,
          oldName: oldName,
          newName: newName,
          status: 'SKIP',
          message: 'Nama sudah sesuai'
        });
        currentNumber++;
        continue;
      }
      
      try {
        const file = DriveApp.getFileById(fileId);
        file.setName(newName);
        
        results.push({
          nomor: originalNomor,
          oldName: oldName,
          newName: newName,
          status: 'BERHASIL',
          message: `Berhasil diubah (dari ${originalNomor} → ${currentNumber})`
        });
        successCount++;
        currentNumber++;
      } catch (error) {
        results.push({
          nomor: originalNomor,
          oldName: oldName,
          newName: newName,
          status: 'GAGAL',
          message: error.toString()
        });
        failCount++;
        currentNumber++;
      }
    }
    
    return {
      success: true,
      successCount: successCount,
      failCount: failCount,
      totalProcessed: selectedItems.length,
      results: results
    };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ==========================================
// DUPLIKAT FILE
// ==========================================

function duplicateSelectedFiles(selectedItems, folderId, duplicateCount, skipFirst, startFromNumber) {
  try {
    let successCount = 0;
    let failCount = 0;
    let totalFilesCreated = 0;
    let results = [];
    const folder = DriveApp.getFolderById(folderId);
    
    selectedItems.sort((a, b) => a.originalNomor - b.originalNomor);
    let currentNumber = skipFirst ? startFromNumber : 1;
    
    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      const originalFile = DriveApp.getFileById(item.fileId);
      const originalNomor = item.originalNomor;
      
      const day = currentNumber.toString().padStart(2, '0');
      const newDate = `${day} ${item.bulan} ${item.tahun}`;
      const baseName = `${currentNumber}. ${item.situs} ${item.customText} - ${newDate}`;
      
      if (!baseName || baseName.trim() === '') {
        results.push({
          nomor: originalNomor,
          oldName: item.oldName,
          newName: baseName,
          status: 'GAGAL',
          message: 'Nama baru kosong',
          filesCreated: 0
        });
        failCount++;
        currentNumber++;
        continue;
      }
      
      let filesCreatedForThis = 0;
      
      try {
        for (let j = 1; j <= duplicateCount; j++) {
          let newName = baseName;
          if (duplicateCount > 1) {
            newName = `${baseName} (${j})`;
          }
          originalFile.makeCopy(newName, folder);
          filesCreatedForThis++;
          totalFilesCreated++;
        }
        
        results.push({
          nomor: originalNomor,
          oldName: item.oldName,
          newName: baseName,
          status: 'BERHASIL',
          message: `Berhasil membuat ${duplicateCount} file duplikat (dari ${originalNomor} → ${currentNumber})`,
          filesCreated: filesCreatedForThis
        });
        successCount++;
        currentNumber++;
        
      } catch (error) {
        results.push({
          nomor: originalNomor,
          oldName: item.oldName,
          newName: baseName,
          status: 'GAGAL',
          message: error.toString(),
          filesCreated: filesCreatedForThis
        });
        failCount++;
        currentNumber++;
      }
    }
    
    return {
      success: true,
      successCount: successCount,
      failCount: failCount,
      totalProcessed: selectedItems.length,
      totalFilesCreated: totalFilesCreated,
      results: results
    };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ==========================================
// GANTI TANGGAL OTOMATIS
// ==========================================

function getMultipleFolders(folderIdsArray) {
  try {
    const folders = [];
    for (let i = 0; i < folderIdsArray.length; i++) {
      try {
        const folder = DriveApp.getFolderById(folderIdsArray[i]);
        folders.push({
          id: folderIdsArray[i],
          name: folder.getName(),
          fileCount: folder.getFilesByType(MimeType.GOOGLE_SHEETS).getIterator().getLengthEstimate()
        });
      } catch(e) {
        folders.push({
          id: folderIdsArray[i],
          name: "ERROR: Folder tidak ditemukan",
          error: true
        });
      }
    }
    return { success: true, folders: folders };
  } catch(error) {
    return { success: false, error: error.toString() };
  }
}

function columnLetterToNumber(letter) {
  let result = 0;
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 64);
  }
  return result;
}

function getBulanName(bulanNumber) {
  const bulanNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return bulanNames[parseInt(bulanNumber) - 1];
}

function executeAutoDate(data) {
  try {
    const folderIds = data.folderIds;
    const tahun = data.tahun;
    const bulan = data.bulan;
    const targetCell = data.targetCell;
    const startFromFile = data.startFromFile;
    const sheetName = data.sheetName || "";
    
    const bulanIndex = parseInt(bulan) - 1;
    const lastDay = new Date(tahun, bulanIndex + 1, 0).getDate();
    
    let totalFilesProcessed = 0;
    let totalFolders = 0;
    let results = [];
    
    for (let f = 0; f < folderIds.length; f++) {
      const folderId = folderIds[f];
      const folderResult = {
        folderId: folderId,
        folderName: "",
        filesProcessed: 0,
        tanggalCounter: 1,
        details: []
      };
      
      try {
        const folder = DriveApp.getFolderById(folderId);
        folderResult.folderName = folder.getName();
        
        const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
        const fileList = [];
        
        while (files.hasNext()) {
          fileList.push(files.next());
        }
        
        fileList.sort(function(a, b) {
          const numA = parseInt(a.getName().match(/\d+/));
          const numB = parseInt(b.getName().match(/\d+/));
          return numA - numB;
        });
        
        let tanggalCounter = 1;
        
        for (let i = startFromFile - 1; i < fileList.length; i++) {
          if (tanggalCounter > lastDay) break;
          
          const file = fileList[i];
          const fileName = file.getName();
          
          try {
            const ss = SpreadsheetApp.open(file);
            let sheet;
            
            if (sheetName && sheetName.trim() !== "") {
              sheet = ss.getSheetByName(sheetName);
              if (!sheet) {
                folderResult.details.push({
                  fileName: fileName,
                  status: "GAGAL",
                  message: `Sheet "${sheetName}" tidak ditemukan`
                });
                continue;
              }
            } else {
              sheet = ss.getSheets()[0];
            }
            
            const cellMatch = targetCell.match(/([A-Z]+)(\d+)/);
            if (!cellMatch) {
              folderResult.details.push({
                fileName: fileName,
                status: "GAGAL",
                message: `Format cell "${targetCell}" tidak valid`
              });
              continue;
            }
            
            const colLetter = cellMatch[1];
            const row = parseInt(cellMatch[2]);
            const col = columnLetterToNumber(colLetter);
            
            const tanggalValue = new Date(tahun, bulanIndex, tanggalCounter);
            sheet.getRange(row, col).setValue(tanggalValue);
            
            folderResult.details.push({
              fileName: fileName,
              status: "BERHASIL",
              tanggal: `${tanggalCounter.toString().padStart(2,'0')}/${bulan.toString().padStart(2,'0')}/${tahun}`,
              cell: targetCell
            });
            
            folderResult.filesProcessed++;
            totalFilesProcessed++;
            tanggalCounter++;
            
          } catch(e) {
            folderResult.details.push({
              fileName: fileName,
              status: "GAGAL",
              message: e.toString()
            });
          }
        }
        
        folderResult.tanggalCounter = tanggalCounter - 1;
        results.push(folderResult);
        totalFolders++;
        
      } catch(e) {
        folderResult.folderName = "ERROR";
        folderResult.details.push({
          fileName: "",
          status: "GAGAL",
          message: `Folder tidak dapat diakses: ${e.toString()}`
        });
        results.push(folderResult);
      }
    }
    
    return {
      success: true,
      totalFolders: totalFolders,
      totalFilesProcessed: totalFilesProcessed,
      results: results,
      bulanName: getBulanName(bulan),
      tahun: tahun,
      lastDay: lastDay
    };
    
  } catch(error) {
    return { success: false, error: error.toString() };
  }
}

// ==========================================
// DUPLIKAT CEPAT
// ==========================================

function getAllFileNumbers(folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
    const fileList = [];
    let nomor = 1;
    
    while (files.hasNext()) {
      const file = files.next();
      fileList.push({
        nomor: nomor++,
        fileId: file.getId(),
        oldName: file.getName()
      });
    }
    fileList.sort((a, b) => a.nomor - b.nomor);
    
    return { success: true, files: fileList, situsList: getSitusList() };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function quickDuplicate(folderId, selectedNumbers, duplicateCount, situs, customText, bulan, tahun, skipFirst, startFromNumber) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
    const fileList = [];
    
    while (files.hasNext()) {
      fileList.push(files.next());
    }
    
    fileList.sort((a, b) => {
      const numA = parseInt(a.getName().match(/\d+/)) || 0;
      const numB = parseInt(b.getName().match(/\d+/)) || 0;
      return numA - numB;
    });
    
    let successCount = 0;
    let failCount = 0;
    let results = [];
    
    let currentNumber = skipFirst ? startFromNumber : 1;
    
    for (let i = 0; i < fileList.length; i++) {
      const fileNomor = i + 1;
      
      if (!selectedNumbers.includes(fileNomor)) continue;
      if (skipFirst && fileNomor === 1) continue;
      
      const file = fileList[i];
      const day = currentNumber.toString().padStart(2, '0');
      const newDate = `${day} ${bulan} ${tahun}`;
      const baseName = `${currentNumber}. ${situs} ${customText} - ${newDate}`;
      
      try {
        for (let j = 1; j <= duplicateCount; j++) {
          let newName = baseName;
          if (duplicateCount > 1) {
            newName = `${baseName} (${j})`;
          }
          file.makeCopy(newName, folder);
        }
        results.push({
          nomor: fileNomor,
          oldName: file.getName(),
          status: 'BERHASIL',
          message: `Berhasil duplikat ${duplicateCount}x`
        });
        successCount++;
      } catch(e) {
        results.push({
          nomor: fileNomor,
          oldName: file.getName(),
          status: 'GAGAL',
          message: e.toString()
        });
        failCount++;
      }
      currentNumber++;
    }
    
    return {
      success: true,
      successCount: successCount,
      failCount: failCount,
      totalProcessed: selectedNumbers.length,
      results: results
    };
    
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}