#!/usr/bin/env python3
import json, os, re, subprocess, sys
from pathlib import Path

class MCPClient:
    def __init__(self, cmd, env=None):
        self.proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, env=env, bufsize=1)
        self._id = 1
    def _send(self, msg):
        self.proc.stdin.write(json.dumps(msg)+"\n"); self.proc.stdin.flush()
    def _read(self):
        line = self.proc.stdout.readline()
        if not line:
            raise RuntimeError("server exited")
        return json.loads(line)
    def request(self, method, params):
        rid=self._id; self._id+=1
        self._send({"jsonrpc":"2.0","id":rid,"method":method,"params":params})
        while True:
            msg=self._read()
            if msg.get("id")==rid:
                if "error" in msg: raise RuntimeError(msg["error"].get("message",str(msg["error"])))
                return msg.get("result",{})
    def notify(self,m,p): self._send({"jsonrpc":"2.0","method":m,"params":p})
    def close(self):
        if self.proc.poll() is None: self.proc.terminate()

def try_tool(client,name,args):
    try:
        text=client.request("tools/call",{"name":name,"arguments":args})['content'][0]['text']
        print(f"{name} OK:\n{text}\n")
        return text
    except Exception as e:
        print(f"{name} ERROR: {e}\n")
        return ""

def main():
    base=Path('/tmp/pjmcp-exp'); project=base/'project-journal'; home=base/'user-home'
    project.mkdir(parents=True,exist_ok=True); home.mkdir(parents=True,exist_ok=True)
    env=os.environ.copy(); env['HOME']=str(home)
    c=MCPClient(["node","/tmp/private-journal-mcp/dist/index.js","--journal-path",str(project)],env=env)
    try:
        print("initialize:",json.dumps(c.request("initialize",{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"exp","version":"1"}}),indent=2))
        c.notify("notifications/initialized",{})
        tools=c.request("tools/list",{})
        print("tools:",", ".join(sorted(t['name'] for t in tools.get('tools',[]))))

        try_tool(c,"process_thoughts",{
            "feelings":"I felt focused while testing and relieved once MCP messaging worked.",
            "project_notes":"Project note: entries should appear under custom --journal-path.",
            "user_context":"User requested reproducible experiments plus screenshots.",
            "technical_insights":"This SDK uses newline-delimited JSON on stdio.",
            "world_knowledge":"Local embedding models can enable private semantic search."})

        print("project_tree:"); [print(" ",p) for p in sorted(project.rglob('*'))]
        uj=home/'.private-journal'; print("user_tree:")
        if uj.exists(): [print(" ",p) for p in sorted(uj.rglob('*'))]
        else: print("  (missing)")

        recent_text=try_tool(c,"list_recent_entries",{"limit":5,"type":"both","days":7})
        search_text=try_tool(c,"search_journal",{"query":"newline-delimited JSON and embeddings","type":"both","limit":5})
        try_tool(c,"search_journal",{"query":"custom journal path","type":"project","sections":["project_notes"],"limit":3})
        m=re.search(r"Path: (.+)", (search_text or recent_text))
        if m:
            try_tool(c,"read_journal_entry",{"path":m.group(1)})
        else:
            md_files=sorted(project.rglob("*.md"))
            if md_files:
                print("read_journal_entry fallback path:", md_files[0])
                try_tool(c,"read_journal_entry",{"path":str(md_files[0])})
            else:
                print("read_journal_entry SKIPPED: no journal files found")
    finally:
        c.close()

if __name__=='__main__': sys.exit(main())
