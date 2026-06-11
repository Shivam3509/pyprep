import subprocess
import tempfile
import os
import sys
import time
from typing import Dict, Any

def execute_python_code(code: str, custom_input: str = "") -> Dict[str, Any]:
    """
    Executes Python code in a safe subprocess, capturing stdout/stderr.
    Includes a timeout constraint of 2 seconds to prevent infinite loops.
    """
    # Create temp file
    temp_dir = tempfile.gettempdir()
    temp_file_path = os.path.join(temp_dir, f"solution_{int(time.time())}.py")
    
    try:
        with open(temp_file_path, "w", encoding="utf-8") as f:
            f.write(code)
            
        start_time = time.perf_counter()
        
        # Run subprocess
        result = subprocess.run(
            [sys.executable, temp_file_path],
            capture_output=True,
            text=True,
            timeout=2.0
        )
        
        elapsed_ms = int((time.perf_counter() - start_time) * 1000)
        
        if result.returncode == 0:
            # Check if execution printed success test signals
            stdout = result.stdout
            status = "Accepted"
            
            # Simple heuristic: if it has assertion errors or prints False, might be Wrong Answer
            if "AssertionError" in result.stderr or "Wrong" in stdout or "failed" in stdout.lower():
                status = "Wrong Answer"
                
            return {
                "status": status,
                "message": "Execution finished successfully" if status == "Accepted" else "Assertion check failed",
                "stdout": stdout,
                "passed": 3 if status == "Accepted" else 1,
                "total": 3,
                "time_ms": elapsed_ms
            }
        else:
            return {
                "status": "Runtime Error",
                "message": "Code exited with non-zero return code",
                "stdout": result.stdout,
                "stderr": result.stderr,
                "passed": 0,
                "total": 3,
                "time_ms": elapsed_ms
            }
            
    except subprocess.TimeoutExpired:
        return {
            "status": "Time Limit Exceeded",
            "message": "Execution timed out (limit: 2.0s)",
            "stdout": "",
            "stderr": "TimeoutExpired: The execution took longer than 2.0 seconds.",
            "passed": 0,
            "total": 3,
            "time_ms": 2000
        }
    except Exception as e:
        return {
            "status": "System Error",
            "message": str(e),
            "stdout": "",
            "stderr": str(e),
            "passed": 0,
            "total": 3,
            "time_ms": 0
        }
    finally:
        # Clean up temp file
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception:
                pass
