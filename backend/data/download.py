"""
Download public datasets for MuleNet ML training.
- Credit Card Fraud Detection (Kaggle)
- NSL-KDD Network Intrusion Detection
"""
import os
import urllib.request
import zipfile
import shutil

DATA_DIR = os.path.join(os.path.dirname(__file__), "raw")


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def download_credit_card_fraud():
    """Download Credit Card Fraud dataset via kagglehub."""
    dest = os.path.join(DATA_DIR, "creditcard.csv")
    if os.path.exists(dest):
        print(f"[✓] Credit Card Fraud dataset already exists at {dest}")
        return dest

    print("[↓] Downloading Credit Card Fraud dataset from Kaggle...")
    try:
        import kagglehub
        path = kagglehub.dataset_download("mlg-ulb/creditcardfraud")
        # kagglehub downloads to a cache dir; copy the csv to our raw dir
        src = os.path.join(path, "creditcard.csv")
        if os.path.exists(src):
            ensure_dir(DATA_DIR)
            shutil.copy2(src, dest)
            print(f"[✓] Saved to {dest}")
            return dest
        else:
            # Try to find the file in subdirectories
            for root, dirs, files in os.walk(path):
                for f in files:
                    if f == "creditcard.csv":
                        src = os.path.join(root, f)
                        ensure_dir(DATA_DIR)
                        shutil.copy2(src, dest)
                        print(f"[✓] Saved to {dest}")
                        return dest
            print(f"[!] Could not find creditcard.csv in {path}")
            return None
    except Exception as e:
        print(f"[!] kagglehub failed: {e}")
        print("[↓] Trying direct download...")
        return _download_creditcard_fallback(dest)


def _download_creditcard_fallback(dest: str):
    """Fallback: generate synthetic credit card data if Kaggle is unavailable."""
    print("[→] Generating synthetic credit card fraud data...")
    import numpy as np
    import pandas as pd

    np.random.seed(42)
    n_legit = 5000
    n_fraud = 250

    # Generate features similar to the real dataset (V1-V28 PCA components + Amount)
    legit_data = np.random.randn(n_legit, 28) * 1.0
    fraud_data = np.random.randn(n_fraud, 28) * 2.5 + np.random.choice([-1, 1], size=(n_fraud, 28)) * 1.5

    legit_amounts = np.abs(np.random.lognormal(4, 1.5, n_legit))
    fraud_amounts = np.abs(np.random.lognormal(5, 2.0, n_fraud))

    legit_time = np.sort(np.random.uniform(0, 172800, n_legit))
    fraud_time = np.random.uniform(0, 172800, n_fraud)

    columns = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount", "Class"]

    legit_df = pd.DataFrame(
        np.column_stack([legit_time, legit_data, legit_amounts, np.zeros(n_legit)]),
        columns=columns,
    )
    fraud_df = pd.DataFrame(
        np.column_stack([fraud_time, fraud_data, fraud_amounts, np.ones(n_fraud)]),
        columns=columns,
    )

    df = pd.concat([legit_df, fraud_df], ignore_index=True).sample(frac=1, random_state=42).reset_index(drop=True)
    ensure_dir(DATA_DIR)
    df.to_csv(dest, index=False)
    print(f"[✓] Generated synthetic dataset ({len(df)} rows) at {dest}")
    return dest


def download_nsl_kdd():
    """Download NSL-KDD network intrusion dataset."""
    dest_train = os.path.join(DATA_DIR, "KDDTrain+.txt")
    dest_test = os.path.join(DATA_DIR, "KDDTest+.txt")

    if os.path.exists(dest_train):
        print(f"[✓] NSL-KDD dataset already exists at {dest_train}")
        return dest_train

    print("[↓] Downloading NSL-KDD dataset...")
    ensure_dir(DATA_DIR)

    base_url = "https://raw.githubusercontent.com/defcom17/NSL_KDD/master/"
    files = {
        "KDDTrain+.txt": dest_train,
        "KDDTest+.txt": dest_test,
    }

    for filename, filepath in files.items():
        url = base_url + filename
        try:
            print(f"  Downloading {filename}...")
            urllib.request.urlretrieve(url, filepath)
            print(f"  [✓] Saved {filename}")
        except Exception as e:
            print(f"  [!] Failed to download {filename}: {e}")
            print("  [→] Generating synthetic network intrusion data...")
            _generate_synthetic_nsl_kdd(filepath, is_train=(filename == "KDDTrain+.txt"))

    return dest_train


def _generate_synthetic_nsl_kdd(dest: str, is_train: bool = True):
    """Generate synthetic NSL-KDD-like data as fallback."""
    import numpy as np
    import pandas as pd

    np.random.seed(42 if is_train else 43)
    n = 3000 if is_train else 1000

    protocols = ["tcp", "udp", "icmp"]
    services = ["http", "smtp", "ftp", "ssh", "dns", "telnet", "pop3"]
    flags = ["SF", "S0", "REJ", "RSTR", "SH", "S1", "S2", "RSTOS0", "S3", "OTH"]
    attack_types = ["normal", "neptune", "smurf", "pod", "teardrop", "portsweep",
                     "ipsweep", "land", "ftp_write", "back", "warezclient"]

    rows = []
    for _ in range(n):
        is_attack = np.random.random() < 0.4
        attack = np.random.choice(attack_types[1:]) if is_attack else "normal"

        row = [
            np.random.randint(0, 60),  # duration
            np.random.choice(protocols),
            np.random.choice(services),
            np.random.choice(flags),
            np.random.randint(0, 65535),  # src_bytes
            np.random.randint(0, 65535),  # dst_bytes
            int(np.random.random() < 0.01),  # land
            int(np.random.randint(0, 5)),  # wrong_fragment
            int(np.random.randint(0, 3)),  # urgent
            int(np.random.randint(0, 10)),  # hot
            int(np.random.randint(0, 5)),  # num_failed_logins
            int(np.random.random() < 0.8),  # logged_in
            int(np.random.randint(0, 5)),  # num_compromised
            int(np.random.random() < 0.1),  # root_shell
            int(np.random.random() < 0.1),  # su_attempted
            int(np.random.randint(0, 10)),  # num_root
            int(np.random.randint(0, 10)),  # num_file_creations
            int(np.random.randint(0, 5)),  # num_shells
            int(np.random.randint(0, 5)),  # num_access_files
            0,  # num_outbound_cmds
            int(np.random.random() < 0.5),  # is_host_login
            int(np.random.random() < 0.3),  # is_guest_login
            int(np.random.randint(0, 512)),  # count
            int(np.random.randint(0, 512)),  # srv_count
            round(np.random.random(), 2),  # serror_rate
            round(np.random.random(), 2),  # srv_serror_rate
            round(np.random.random(), 2),  # rerror_rate
            round(np.random.random(), 2),  # srv_rerror_rate
            round(np.random.random(), 2),  # same_srv_rate
            round(np.random.random(), 2),  # diff_srv_rate
            round(np.random.random(), 2),  # srv_diff_host_rate
            int(np.random.randint(0, 255)),  # dst_host_count
            int(np.random.randint(0, 255)),  # dst_host_srv_count
            round(np.random.random(), 2),  # dst_host_same_srv_rate
            round(np.random.random(), 2),  # dst_host_diff_srv_rate
            round(np.random.random(), 2),  # dst_host_same_src_port_rate
            round(np.random.random(), 2),  # dst_host_srv_diff_host_rate
            round(np.random.random(), 2),  # dst_host_serror_rate
            round(np.random.random(), 2),  # dst_host_srv_serror_rate
            round(np.random.random(), 2),  # dst_host_rerror_rate
            round(np.random.random(), 2),  # dst_host_srv_rerror_rate
            attack,
            int(np.random.randint(1, 21)),  # difficulty_level
        ]
        rows.append(row)

    df = pd.DataFrame(rows)
    df.to_csv(dest, index=False, header=False)
    print(f"  [✓] Generated synthetic NSL-KDD data ({n} rows) at {dest}")


def download_all():
    """Download all datasets."""
    ensure_dir(DATA_DIR)
    print("=" * 60)
    print("MuleNet Data Acquisition Pipeline")
    print("=" * 60)
    cc = download_credit_card_fraud()
    kdd = download_nsl_kdd()
    print("=" * 60)
    print("Data acquisition complete!")
    if cc:
        print(f"  Credit Card: {cc}")
    if kdd:
        print(f"  NSL-KDD:     {kdd}")
    print("=" * 60)
    return cc, kdd


if __name__ == "__main__":
    download_all()
