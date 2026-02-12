import subprocess
import tempfile
import os
import shutil
from typing import Dict, Any, Optional
from pathlib import Path

class CodeExecutor:
    """
    Execute code in multiple languages.

    WARNING: This executor runs user-provided code directly on the host system.
    This is a MAJOR SECURITY VULNERABILITY and should NEVER be used in production
    without proper sandboxing (e.g., Docker, gVisor, or Firecracker).
    """

    # Timeout in seconds to prevent infinite loops
    TIMEOUT = 5

    @staticmethod
    def execute_python(code: str, input_data: str = "") -> Dict[str, Any]:
        """Execute Python code with basic security warnings"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(code)
                temp_file = f.name

            try:
                result = subprocess.run(
                    ['python', temp_file],
                    input=input_data,
                    capture_output=True,
                    text=True,
                    timeout=CodeExecutor.TIMEOUT
                )

                return {
                    "success": result.returncode == 0,
                    "output": result.stdout,
                    "error": result.stderr,
                    "exit_code": result.returncode
                }
            finally:
                os.unlink(temp_file)

        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "output": "",
                "error": f"Execution timed out after {CodeExecutor.TIMEOUT} seconds",
                "exit_code": -1
            }
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": str(e),
                "exit_code": -1
            }

    @staticmethod
    def execute_cpp(code: str, input_data: str = "") -> Dict[str, Any]:
        """Execute C++ code with basic security warnings"""
        try:
            # Create temp directory
            temp_dir = tempfile.mkdtemp()
            source_file = os.path.join(temp_dir, 'main.cpp')
            exe_file = os.path.join(temp_dir, 'main.exe')

            try:
                # Write source code
                with open(source_file, 'w') as f:
                    f.write(code)

                # Compile
                compile_result = subprocess.run(
                    ['g++', source_file, '-o', exe_file],
                    capture_output=True,
                    text=True,
                    timeout=CodeExecutor.TIMEOUT
                )

                if compile_result.returncode != 0:
                    return {
                        "success": False,
                        "output": "",
                        "error": f"Compilation error:\n{compile_result.stderr}",
                        "exit_code": compile_result.returncode
                    }

                # Execute
                result = subprocess.run(
                    [exe_file],
                    input=input_data,
                    capture_output=True,
                    text=True,
                    timeout=CodeExecutor.TIMEOUT
                )

                return {
                    "success": result.returncode == 0,
                    "output": result.stdout,
                    "error": result.stderr,
                    "exit_code": result.returncode
                }
            finally:
                shutil.rmtree(temp_dir, ignore_errors=True)

        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "output": "",
                "error": f"Execution timed out after {CodeExecutor.TIMEOUT} seconds",
                "exit_code": -1
            }
        except FileNotFoundError:
            return {
                "success": False,
                "output": "",
                "error": "C++ compiler (g++) not found. Please install MinGW or GCC.",
                "exit_code": -1
            }
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": str(e),
                "exit_code": -1
            }

    @staticmethod
    def execute_java(code: str, input_data: str = "") -> Dict[str, Any]:
        """Execute Java code"""
        try:
            # Create temp directory
            temp_dir = tempfile.mkdtemp()

            # Extract class name from code
            class_name = "Main"
            if "public class" in code:
                import re
                match = re.search(r'public\s+class\s+(\w+)', code)
                if match:
                    class_name = match.group(1)

            source_file = os.path.join(temp_dir, f'{class_name}.java')

            try:
                # Write source code
                with open(source_file, 'w') as f:
                    f.write(code)

                # Compile
                compile_result = subprocess.run(
                    ['javac', source_file],
                    capture_output=True,
                    text=True,
                    timeout=CodeExecutor.TIMEOUT,
                    cwd=temp_dir
                )

                if compile_result.returncode != 0:
                    return {
                        "success": False,
                        "output": "",
                        "error": f"Compilation error:\n{compile_result.stderr}",
                        "exit_code": compile_result.returncode
                    }

                # Execute
                result = subprocess.run(
                    ['java', class_name],
                    input=input_data,
                    capture_output=True,
                    text=True,
                    timeout=CodeExecutor.TIMEOUT,
                    cwd=temp_dir
                )

                return {
                    "success": result.returncode == 0,
                    "output": result.stdout,
                    "error": result.stderr,
                    "exit_code": result.returncode
                }
            finally:
                shutil.rmtree(temp_dir, ignore_errors=True)

        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "output": "",
                "error": f"Execution timed out after {CodeExecutor.TIMEOUT} seconds",
                "exit_code": -1
            }
        except FileNotFoundError:
            return {
                "success": False,
                "output": "",
                "error": "Java compiler (javac) not found. Please install JDK.",
                "exit_code": -1
            }
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": str(e),
                "exit_code": -1
            }

    @staticmethod
    def execute_javascript(code: str, input_data: str = "") -> Dict[str, Any]:
        """Execute JavaScript code"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
                f.write(code)
                temp_file = f.name

            try:
                result = subprocess.run(
                    ['node', temp_file],
                    input=input_data,
                    capture_output=True,
                    text=True,
                    timeout=CodeExecutor.TIMEOUT
                )

                return {
                    "success": result.returncode == 0,
                    "output": result.stdout,
                    "error": result.stderr,
                    "exit_code": result.returncode
                }
            finally:
                os.unlink(temp_file)

        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "output": "",
                "error": f"Execution timed out after {CodeExecutor.TIMEOUT} seconds",
                "exit_code": -1
            }
        except FileNotFoundError:
            return {
                "success": False,
                "output": "",
                "error": "Node.js not found. Please install Node.js.",
                "exit_code": -1
            }
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": str(e),
                "exit_code": -1
            }

    @staticmethod
    def execute(language: str, code: str, input_data: str = "") -> Dict[str, Any]:
        """Execute code based on language"""
        executors = {
            "python": CodeExecutor.execute_python,
            "cpp": CodeExecutor.execute_cpp,
            "java": CodeExecutor.execute_java,
            "javascript": CodeExecutor.execute_javascript,
        }

        executor = executors.get(language.lower())
        if not executor:
            return {
                "success": False,
                "output": "",
                "error": f"Unsupported language: {language}",
                "exit_code": -1
            }

        return executor(code, input_data)
