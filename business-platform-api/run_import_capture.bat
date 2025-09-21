@echo off
REM Run the diagnostic Python script and capture output to a workspace file
python import_diag_temp.py > import_trace_capture.txt 2>&1
echo EXIT_CODE=%ERRORLEVEL%
type import_trace_capture.txt
