# TestStation
A sample program using [the Active Station](https://github.com/javadbayat/ActiveStation) technology. What this program does is simply move the cursor in a geometric path around the screen.

The script `Cursor.js` is the main file that must be opened to start the program. It is accompanied by a DLL file named `TestStation.dll`, which you obtain by building the C++ source code in this repository.

Since the DLL is based on **Active Station**, building it requires the static library files `libstation.x86.lib` and `libstation.x64.lib` to be present in the project directory. To obtain these files, head to [the ActiveStation repository](https://github.com/javadbayat/ActiveStation), and compile the static library's source code from that repository. 
